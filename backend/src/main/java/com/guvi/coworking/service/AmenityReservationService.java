package com.guvi.coworking.service;

import com.guvi.coworking.model.*;
import com.guvi.coworking.repository.AmenityReservationRepository;
import com.guvi.coworking.repository.AmenityRepository;
import com.guvi.coworking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Service
public class AmenityReservationService {

    @Autowired
    private AmenityReservationRepository reservationRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional
    public AmenityReservation reserveAmenity(Long bookingId, Long amenityId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        Amenity amenity = amenityRepository.findById(amenityId)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));

        if (amenity.getAvailabilityStatus().equals(AmenityStatus.UNAVAILABLE)) {
            throw new RuntimeException("Amenity is currently out of service.");
        }

        // Check for time-based overlap
        boolean isOverlapping = reservationRepository.existsOverlappingReservation(
                amenityId,
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                Arrays.asList(ReservationStatus.REJECTED, ReservationStatus.CANCELLED, ReservationStatus.COMPLETED)
        );

        if (isOverlapping) {
            throw new RuntimeException("This amenity is already reserved for the selected time slot.");
        }

        AmenityReservation reservation = AmenityReservation.builder()
                .booking(booking)
                .amenity(amenity)
                .reservationDate(booking.getBookingDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .reservationStatus(ReservationStatus.REQUESTED)
                .build();

        return reservationRepository.save(reservation);
    }

    @Transactional
    public AmenityReservation approveReservation(Long reservationId) {
        AmenityReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.setReservationStatus(ReservationStatus.APPROVED);
        
        // Update Amenity global status to reflect occupation
        Amenity amenity = reservation.getAmenity();
        amenity.setAvailabilityStatus(AmenityStatus.RESERVED);
        amenityRepository.save(amenity);
        
        return reservationRepository.save(reservation);
    }

    @Transactional
    public AmenityReservation rejectReservation(Long reservationId) {
        AmenityReservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        reservation.setReservationStatus(ReservationStatus.REJECTED);
        
        // Ensure Amenity is marked as AVAILABLE if this was the active reservation
        Amenity amenity = reservation.getAmenity();
        amenity.setAvailabilityStatus(AmenityStatus.AVAILABLE);
        amenityRepository.save(amenity);
        
        return reservationRepository.save(reservation);
    }

    @Transactional
    public void releaseAmenitiesByBooking(Long bookingId) {
        List<AmenityReservation> reservations = reservationRepository.findByBookingId(bookingId);
        for (AmenityReservation res : reservations) {
            if (res.getReservationStatus() == ReservationStatus.APPROVED || res.getReservationStatus() == ReservationStatus.REQUESTED) {
                Amenity amenity = res.getAmenity();
                amenity.setAvailabilityStatus(AmenityStatus.AVAILABLE);
                amenityRepository.save(amenity);
                
                // Transition reservation status to a non-blocking state
                if (res.getReservationStatus() == ReservationStatus.REQUESTED) {
                    res.setReservationStatus(ReservationStatus.CANCELLED);
                } else {
                    res.setReservationStatus(ReservationStatus.COMPLETED);
                }
                reservationRepository.save(res);
            }
        }
    }

    public List<AmenityReservation> getReservationsByBooking(Long bookingId) {
        return reservationRepository.findByBookingId(bookingId);
    }

    public List<AmenityReservation> getAllReservations() {
        return reservationRepository.findAll();
    }
}
