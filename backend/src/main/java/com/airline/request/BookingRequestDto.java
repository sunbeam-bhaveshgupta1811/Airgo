//package com.sunbeam.request;
//
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.util.List;
//
//import com.sunbeam.entities.Booking.BookingStatus;
//import com.sunbeam.entities.Booking.ClassType;
//import com.sunbeam.entities.Booking.PaymentMethod;
//import com.sunbeam.entities.Booking.PaymentStatus;
//
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Getter
//@Setter
//@NoArgsConstructor
//public class BookingRequestDto {
//    // Flight Info
//    private Long userId;
//    private Long flightId;
//    private String flightNumber;
//    private String airline;
//    private String source;
//    private String destination;
//    private LocalDate departureDate;
//    private LocalTime departureTime;
//    private LocalDate arrivalDate;
//    private LocalTime arrivalTime;
//
//    // Booking Info
//    private ClassType classType;
//    private Integer totalPassengers;
//    private BigDecimal totalFare;
//
//    // Passenger Info
//    private List<PassengerRequestDto> passengers;
//
//    // Payment Info
//    private PaymentMethod paymentMethod;
//    private PaymentStatus paymentStatus;
//    private String transactionId;
//
//    // Extra Info
//    private BookingStatus bookingStatus;
//    private String searchParams;
//    private String specialRequests;
//    private String notes;
//
//    // ✅ Custom Constructor (if you ever want to call without passengers)
//    public BookingRequestDto(
//            Long userId,
//            Long flightId,
//            String flightNumber,
//            String airline,
//            String source,
//            String destination,
//            LocalDate departureDate,
//            LocalTime departureTime,
//            LocalDate arrivalDate,
//            LocalTime arrivalTime,
//            ClassType classType,
//            Integer totalPassengers,
//            BigDecimal totalFare,
//            PaymentMethod paymentMethod,
//            PaymentStatus paymentStatus,
//            String transactionId,
//            BookingStatus bookingStatus,
//            String searchParams,
//            String specialRequests,
//            String notes
//    ) {
//        this.userId = userId;
//        this.flightId = flightId;
//        this.flightNumber = flightNumber;
//        this.airline = airline;
//        this.source = source;
//        this.destination = destination;
//        this.departureDate = departureDate;
//        this.departureTime = departureTime;
//        this.arrivalDate = arrivalDate;
//        this.arrivalTime = arrivalTime;
//        this.classType = classType;
//        this.totalPassengers = totalPassengers;
//        this.totalFare = totalFare;
//        this.paymentMethod = paymentMethod;
//        this.paymentStatus = paymentStatus;
//        this.transactionId = transactionId;
//        this.bookingStatus = bookingStatus;
//        this.searchParams = searchParams;
//        this.specialRequests = specialRequests;
//        this.notes = notes;
//    }
//}
