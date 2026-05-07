package com.airline.dao;

import com.airline.entity.Booking;
import com.airline.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingDao extends JpaRepository<Booking, Long> {

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Booking> findByBookingReference(String bookingReference);

    List<Booking> findByFlightScheduleId(Long scheduleId);

    List<Booking> findByStatus(BookingStatus status);

    boolean existsByUserIdAndFlightScheduleIdAndStatusNot(
            Long userId, Long scheduleId, BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status = 'CONFIRMED'")
    BigDecimal getTotalRevenue();

    @Query("""
            SELECT b.flightSchedule.flight.airline.name, COALESCE(SUM(b.totalAmount), 0)
            FROM Booking b
            WHERE b.status = 'CONFIRMED'
            GROUP BY b.flightSchedule.flight.airline.name
            """)
    List<Object[]> getRevenueByAirline();
}