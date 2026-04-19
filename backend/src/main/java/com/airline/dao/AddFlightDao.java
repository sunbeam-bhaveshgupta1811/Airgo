//package com.airline.dao;
//
//import java.util.Optional;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.airline.entity.AddFlights;
//
//public interface AddFlightDao extends JpaRepository<AddFlights, Long>{
//	 Optional<AddFlights> findByFlightNo(String flightNo);
//	    void deleteByFlightNo(String flightNo);
//
////	@Modifying
////	@Query("DELETE FROM AddFlight f WHERE f.airline.airlineId = :airlineId")
////	void deleteByAirlineId(@Param("airlineId") Long airlineId);
//}
