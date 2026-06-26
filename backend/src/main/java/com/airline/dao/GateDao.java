package com.airline.dao;

import com.airline.entity.Gate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GateDao extends JpaRepository<Gate, Long> {
    List<Gate> findByTerminalId(Long terminalId);
    List<Gate> findByTerminalIdAndActive(Long terminalId, boolean active);
    boolean existsByTerminalIdAndGateNumber(Long terminalId, String gateNumber);
    boolean existsByTerminalIdAndGateNumberAndIdNot(Long terminalId, String gateNumber, Long id);

    @Query("SELECT g FROM Gate g WHERE g.terminal.airport.id = :airportId")
    List<Gate> findByAirportId(@Param("airportId") Long airportId);
}
