//package com.sunbeam.dao;
//
//
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//
//import com.sunbeam.entities.Booking;
//
//public interface BookingDao extends JpaRepository<Booking, Long> {
//    Optional<Booking> findByBookingId(Long bookingId);
//
//    List<Booking> findByUserId(Long userId);
//    List<Booking> findByFlightNumber(String flightNumber);
//    List<Booking> findByBookingStatus(Booking.BookingStatus bookingStatus);
//    List<Booking> findByTransactionId(String transactionId);
//
//    @Query("select sum(totalFare) from Booking")
//	Double getTotalAmountBookingPassenger();
//
//}
//
//
