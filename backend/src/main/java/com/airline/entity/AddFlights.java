//package com.airline.entity;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import jakarta.persistence.CascadeType;
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.OneToMany;
//import jakarta.persistence.PrePersist;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//@Entity
//@Table(name = "add_flights")
//@Getter
//@Setter
//@NoArgsConstructor
//@AllArgsConstructor
//public class AddFlights {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long flightId;
//
//    @ManyToOne
//    @JoinColumn(name = "airline_id", nullable = false)
//    private AirlineDetail airlineDetail;
//
//    @ManyToOne
//    @JoinColumn(name = "admin_id")
//    private User admin;
//
//    @Column(name = "flight_no", nullable = false, length = 10)
//    private String flightNo;
//
//    @Column(name = "has_economy", nullable = false)
//    private boolean hasEconomy = false;
//
//    @Column(name = "has_business", nullable = false)
//    private boolean hasBusiness = false;
//
//    @Column(name = "has_first", nullable = false)
//    private boolean hasFirst = false;
//
//
//    @Column(name = "no_of_economy_seats")
//    private Long noOfEconomySeats = 0L;
//
//    @Column(name = "no_of_first_seats")
//    private Long noOfFirstSeats = 0L;
//
//    @Column(name = "no_of_business_seats")
//    private Long noOfBusinessSeats = 0L;
//
//    @Column(name = "total_no_of_seats", insertable = false, updatable = false)
//    private Long totalNoOfSeats;
//
//    @OneToMany(mappedBy = "flight", cascade = CascadeType.ALL)
//    private List<ScheduleFlight> schedules = new ArrayList<>();
//
//
//    @PrePersist
//    public void calculateTotalSeats() {
//        if (totalNoOfSeats == null) {
//            totalNoOfSeats = (noOfEconomySeats != null ? noOfEconomySeats : 0L)
//                           + (noOfFirstSeats != null ? noOfFirstSeats : 0L)
//                           + (noOfBusinessSeats != null ? noOfBusinessSeats : 0L);
//        }
//
//    }
//}
