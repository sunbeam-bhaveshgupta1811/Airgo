package com.airline.reservation.service;

import com.airline.reservation.repository.BookingRepository;
import com.airline.reservation.repository.FlightScheduleRepository;
import com.airline.reservation.entity.Booking;
import com.airline.reservation.entity.BookingStatus;
import com.airline.reservation.entity.FlightSchedule;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * The one place a booking is cancelled and its seats returned to the schedule.
 *
 * Cancellation used to be implemented twice — once in BookingServiceImpl.cancelBooking and
 * again in PaymentServiceImpl.refundPayment — and neither checked whether the other had
 * already run. The ordinary support flow (customer cancels, admin then refunds) therefore
 * incremented availableSeats twice, inflating inventory on every cancelled-then-refunded
 * booking until the schedule oversold.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BookingCancellationService {

    private final BookingRepository bookingRepository;
    private final FlightScheduleRepository scheduleRepository;

    /**
     * Move {@code booking} to CANCELLED and release its seats — at most once.
     *
     * @return true if this call performed the cancellation; false if it was already cancelled
     *         and nothing was changed. Callers use the result to avoid duplicate side effects
     *         such as sending a second cancellation email.
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public boolean cancelAndReleaseSeats(Booking booking) {
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            log.debug("Booking {} is already cancelled — not releasing seats again",
                    booking.getBookingReference());
            return false;
        }

        FlightSchedule schedule = booking.getFlightSchedule();
        schedule.setAvailableSeats(schedule.getAvailableSeats() + booking.getNumberOfPassengers());
        scheduleRepository.save(schedule);

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        log.info("Booking {} cancelled; {} seat(s) returned to schedule {}",
                booking.getBookingReference(), booking.getNumberOfPassengers(), schedule.getId());
        return true;
    }
}
