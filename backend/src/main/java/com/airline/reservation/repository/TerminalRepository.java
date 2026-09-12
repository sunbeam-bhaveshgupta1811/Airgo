package com.airline.reservation.repository;

import com.airline.reservation.entity.Terminal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TerminalRepository extends JpaRepository<Terminal, Long> {
    List<Terminal> findByAirportId(Long airportId);
    List<Terminal> findByAirportIdAndActive(Long airportId, boolean active);
    boolean existsByAirportIdAndTerminalCode(Long airportId, String terminalCode);
    boolean existsByAirportIdAndTerminalCodeAndIdNot(Long airportId, String terminalCode, Long id);
}
