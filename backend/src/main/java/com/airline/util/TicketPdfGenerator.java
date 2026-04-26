package com.airline.util;

import com.airline.entity.Booking;
import com.airline.entity.Payment;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Component;

import java.io.ByteArrayOutputStream;

@Component
public class TicketPdfGenerator {

    public byte[] generateTicket(Booking booking, Payment payment) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("✈️ Airline Ticket")
                    .setBold().setFontSize(18));

            document.add(new Paragraph("Booking ID: " + booking.getId()));
            document.add(new Paragraph("Passenger Count: " + booking.getPassengers().size()));
            document.add(new Paragraph("Flight: " + booking.getFlightSchedule().getFlight().getFlightNumber()));
            document.add(new Paragraph("Amount Paid: ₹" + payment.getAmount()));

            document.add(new Paragraph("Thank you for choosing AirlineApp!"));

            document.close();
            return out.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
}