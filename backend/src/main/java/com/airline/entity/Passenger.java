//package com.sunbeam.entities;
//
//import java.time.LocalDate;
//
//import com.fasterxml.jackson.annotation.JsonManagedReference;
//
//import jakarta.persistence.Column;
//import jakarta.persistence.Entity;
//import jakarta.persistence.EnumType;
//import jakarta.persistence.Enumerated;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//import jakarta.persistence.JoinColumn;
//import jakarta.persistence.ManyToOne;
//import jakarta.persistence.Table;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.LocalDateTime;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "passengers")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Passenger {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "booking_id")
//    private Booking booking;
//
//    @Column(name = "name", nullable = false)
//    private String name;
//
//    @Column(name = "age")
//    private Integer age;
//
//    @Column(name = "gender")
//    @Enumerated(EnumType.STRING)
//    private Gender gender;
//
//    @Column(name = "seat_number")
//    private String seatNumber;
//
//    @Column(name = "passport_number")
//    private String passportNumber;
//
//    @Column(name = "special_requests", columnDefinition = "TEXT")
//    private String specialRequests;
//
//    @Column(name = "meal_preference")
//    @Enumerated(EnumType.STRING)
//    private MealPreference mealPreference;
//
//    @Column(name = "date_of_birth")
//    private LocalDate dateOfBirth;
//
//    @CreationTimestamp
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    // Enums
//    public enum Gender {
//        MALE("Male"),
//        FEMALE("Female"),
//        OTHER("Other");
//
//        private final String displayName;
//
//        Gender(String displayName) {
//            this.displayName = displayName;
//        }
//
//        public String getDisplayName() {
//            return displayName;
//        }
//    }
//
//    public enum MealPreference {
//        VEGETARIAN("Vegetarian"),
//        NON_VEGETARIAN("Non-Vegetarian"),
//        VEGAN("Vegan"),
//        JAIN("Jain"),
//        DIABETIC("Diabetic"),
//        NONE("No Preference");
//
//        private final String displayName;
//
//        MealPreference(String displayName) {
//            this.displayName = displayName;
//        }
//
//        public String getDisplayName() {
//            return displayName;
//        }
//    }
//}
