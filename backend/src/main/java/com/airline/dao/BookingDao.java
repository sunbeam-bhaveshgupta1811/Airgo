package com.airline.dao;

import com.airline.entity.Booking;
import com.airline.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingDao extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.user
            JOIN FETCH b.flightSchedule fs
            JOIN FETCH fs.flight f
            JOIN FETCH f.airline
            JOIN FETCH f.originAirport
            JOIN FETCH f.destinationAirport
            LEFT JOIN FETCH b.passengers
            LEFT JOIN FETCH b.payment
            WHERE b.user.id = :userId
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByUserIdWithDetails(@Param("userId") Long userId);

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.user
            JOIN FETCH b.flightSchedule fs
            JOIN FETCH fs.flight f
            JOIN FETCH f.airline
            JOIN FETCH f.originAirport
            JOIN FETCH f.destinationAirport
            LEFT JOIN FETCH b.passengers
            LEFT JOIN FETCH b.payment
            """)
    List<Booking> findAllWithDetails();

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

    @Query("""
            SELECT DISTINCT b FROM Booking b
            JOIN FETCH b.user
            JOIN FETCH b.flightSchedule fs
            JOIN FETCH fs.flight f
            JOIN FETCH f.airline
            JOIN FETCH f.originAirport
            JOIN FETCH f.destinationAirport
            LEFT JOIN FETCH b.passengers
            LEFT JOIN FETCH b.payment
            WHERE f.originAirport.id = :airportId OR f.destinationAirport.id = :airportId
            """)
    List<Booking> findByAirportIdWithDetails(@Param("airportId") Long airportId);
}