//package com.airline.dao;
//
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//import org.springframework.stereotype.Repository;
//
//import com.airline.entity.ScheduleFlight;
//import com.airline.response.FlightSearchResponseDto;
//
//@Repository
//public interface ScheduleFlightDao extends JpaRepository<ScheduleFlight, Long> {
//
//	@Query(value = "SELECT " + "f.flight_id, " + "f.flight_no, " + "a.airline_name, " + "s.source AS fromLocation, "
//			+ "s.destination AS toLocation, " + "DATE(s.departure) AS departureDate, "
//			+ "DATE(s.arrival) AS arrivalDate, " + "TIME(s.departure) AS departureTime, "
//			+ "TIME(s.arrival) AS arrivalTime, " + "s.seat_cost_of_economy AS economyFare, "
//			+ "s.seat_cost_of_business AS businessFare, " + "s.seat_cost_of_first AS firstFare, "
//			+ "f.no_of_economy_seats AS availableEconomySeats, " + "f.no_of_business_seats AS availableBusinessSeats, "
//			+ "f.no_of_first_seats AS availableFirstSeats " + "FROM schedule_flight s "
//			+ "JOIN add_flights f ON s.flight_id = f.flight_id "
//			+ "JOIN airline_details a ON f.airline_id = a.airline_id "
//			+ "WHERE s.source = :source AND s.destination = :destination AND DATE(s.departure) = :departureDate", nativeQuery = true)
//	List<FlightSearchResponseDto> searchFlights(@Param("source") String source,
//			@Param("destination") String destination, @Param("departureDate") LocalDate departureDate);
//
//	Optional<ScheduleFlight> findByFlight_FlightIdAndArrivalAndDepartureAndSourceAndDestination(Long flightId,
//			LocalDateTime arrival, LocalDateTime departure, String source, String destination);
//
//
//
//
//}
