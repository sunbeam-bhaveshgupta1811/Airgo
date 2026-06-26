package com.airline.util;

import com.airline.entity.Booking;
import com.airline.entity.Passenger;
import com.airline.entity.Payment;
import com.airline.entity.Flight;
import com.airline.entity.FlightSchedule;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

@Component
@Slf4j
public class TicketPdfGenerator {

    private static final DeviceRgb PRIMARY_COLOR = new DeviceRgb(15, 94, 168);
    private static final DeviceRgb HEADER_BG = new DeviceRgb(15, 94, 168);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public byte[] generateTicket(Booking booking, Payment payment) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document doc = new Document(pdf);
            doc.setMargins(20, 20, 20, 20);

            FlightSchedule schedule = booking.getFlightSchedule();
            Flight flight = schedule.getFlight();

            // Header
            Paragraph header = new Paragraph("AIRGO E-TICKET")
                    .setBold()
                    .setFontSize(22)
                    .setFontColor(ColorConstants.WHITE)
                    .setBackgroundColor(HEADER_BG)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setPadding(15);
            doc.add(header);

            doc.add(new Paragraph("\n"));

            // Booking Info + QR Code Table
            Table topTable = new Table(UnitValue.createPercentArray(new float[]{70, 30}))
                    .useAllAvailableWidth();

            // Left side - Booking Info
            Cell infoCell = new Cell().setBorder(Border.NO_BORDER);
            infoCell.add(createInfoRow("Booking ID", String.valueOf(booking.getId())));
            infoCell.add(createInfoRow("Booking Ref", booking.getBookingReference()));
            infoCell.add(createInfoRow("Flight", flight.getFlightNumber()));
            infoCell.add(createInfoRow("Airline", flight.getAirline().getName()));
            infoCell.add(createInfoRow("Route", flight.getOriginAirport().getCity() + " (" + flight.getOriginAirport().getCode() + ") \u2192 " + flight.getDestinationAirport().getCity() + " (" + flight.getDestinationAirport().getCode() + ")"));
            infoCell.add(createInfoRow("Date", schedule.getJourneyDate().format(DATE_FMT)));
            infoCell.add(createInfoRow("Departure", schedule.getDepartureTime().format(TIME_FMT)));
            infoCell.add(createInfoRow("Arrival", schedule.getArrivalTime().format(TIME_FMT)));
            topTable.addCell(infoCell);

            // Right side - QR Code
            Cell qrCell = new Cell().setBorder(Border.NO_BORDER)
                    .setTextAlignment(TextAlignment.CENTER);
            try {
                byte[] qrBytes = generateQRCode(booking.getBookingReference());
                Image qrImage = new Image(ImageDataFactory.create(qrBytes))
                        .setWidth(120)
                        .setHeight(120);
                qrCell.add(qrImage);
                qrCell.add(new Paragraph("Scan for details")
                        .setFontSize(8).setTextAlignment(TextAlignment.CENTER));
            } catch (Exception e) {
                qrCell.add(new Paragraph("QR unavailable").setFontSize(10));
            }
            topTable.addCell(qrCell);
            doc.add(topTable);

            // Separator
            doc.add(new Paragraph("\u2500".repeat(80)).setFontSize(8).setFontColor(ColorConstants.GRAY));

            // Passenger Details
            doc.add(new Paragraph("PASSENGER DETAILS")
                    .setBold().setFontSize(14).setFontColor(PRIMARY_COLOR).setMarginTop(10));

            Table passengerTable = new Table(UnitValue.createPercentArray(new float[]{10, 30, 15, 15, 15, 15}))
                    .useAllAvailableWidth();
            passengerTable.addHeaderCell(createHeaderCell("#"));
            passengerTable.addHeaderCell(createHeaderCell("Name"));
            passengerTable.addHeaderCell(createHeaderCell("Gender"));
            passengerTable.addHeaderCell(createHeaderCell("ID Type"));
            passengerTable.addHeaderCell(createHeaderCell("ID Number"));
            passengerTable.addHeaderCell(createHeaderCell("Seat"));

            int idx = 1;
            for (Passenger p : booking.getPassengers()) {
                passengerTable.addCell(createDataCell(String.valueOf(idx++)));
                passengerTable.addCell(createDataCell(p.getFirstName() + " " + p.getLastName()));
                passengerTable.addCell(createDataCell(p.getGender() != null ? p.getGender().name() : "-"));
                passengerTable.addCell(createDataCell(p.getIdType() != null ? p.getIdType() : "-"));
                passengerTable.addCell(createDataCell(p.getIdNumber() != null ? p.getIdNumber() : "-"));
                passengerTable.addCell(createDataCell(p.getSeatNumber() != null ? p.getSeatNumber() : "TBD"));
            }
            doc.add(passengerTable);

            // Separator
            doc.add(new Paragraph("\u2500".repeat(80)).setFontSize(8).setFontColor(ColorConstants.GRAY).setMarginTop(10));

            // Payment Details
            doc.add(new Paragraph("PAYMENT DETAILS")
                    .setBold().setFontSize(14).setFontColor(PRIMARY_COLOR).setMarginTop(10));

            if (payment != null) {
                doc.add(createInfoRow("Transaction ID", payment.getTransactionId()));
                doc.add(createInfoRow("Amount Paid", "\u20b9" + payment.getAmount().toPlainString()));
                doc.add(createInfoRow("Payment Method", payment.getPaymentMethod().name()));
                doc.add(createInfoRow("Payment Status", payment.getStatus().name()));
                if (payment.getPaidAt() != null) {
                    doc.add(createInfoRow("Paid At", payment.getPaidAt().format(DateTimeFormatter.ofPattern("dd MMM yyyy HH:mm"))));
                }
            }

            // Footer
            doc.add(new Paragraph("\n"));
            doc.add(new Paragraph("Thank you for choosing Airgo! Have a pleasant journey.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(10)
                    .setItalic()
                    .setFontColor(ColorConstants.GRAY));
            doc.add(new Paragraph("This is a computer-generated ticket. No signature required.")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(8)
                    .setFontColor(ColorConstants.GRAY));

            doc.close();
            return out.toByteArray();

        } catch (Exception e) {
            log.error("Error generating PDF ticket: {}", e.getMessage());
            throw new RuntimeException("Error generating PDF ticket", e);
        }
    }

    private Paragraph createInfoRow(String label, String value) {
        return new Paragraph()
                .add(new Text(label + ": ").setBold().setFontSize(10))
                .add(new Text(value != null ? value : "-").setFontSize(10))
                .setMarginBottom(2);
    }

    private Cell createHeaderCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setBold().setFontSize(9).setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(PRIMARY_COLOR)
                .setPadding(5);
    }

    private Cell createDataCell(String text) {
        return new Cell()
                .add(new Paragraph(text).setFontSize(9))
                .setPadding(4);
    }

    private byte[] generateQRCode(String content) throws WriterException, java.io.IOException {
        QRCodeWriter qrWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrWriter.encode(content, BarcodeFormat.QR_CODE, 200, 200);
        ByteArrayOutputStream qrOut = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrOut);
        return qrOut.toByteArray();
    }
}
