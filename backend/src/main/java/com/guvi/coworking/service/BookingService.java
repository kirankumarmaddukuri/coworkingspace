package com.guvi.coworking.service;

import com.guvi.coworking.dto.request.BookingRequest;
import com.guvi.coworking.model.*;
import com.guvi.coworking.repository.BookingRepository;
import com.guvi.coworking.repository.DeskRepository;
import com.guvi.coworking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DeskRepository deskRepository;

    @Autowired
    private AmenityReservationService amenityReservationService;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Booking createBooking(BookingRequest request, String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Desk desk = deskRepository.findById(request.getDeskId())
                .orElseThrow(() -> new RuntimeException("Desk not found"));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setDesk(desk);
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setBookingStatus(BookingStatus.REQUESTED);

        validateBookingDuration(booking);
        checkOverlap(booking);
        
        // Update Desk status
        desk.setAvailabilityStatus(DeskStatus.RESERVED);
        deskRepository.save(desk);

        Booking savedBooking = bookingRepository.save(booking);

        // Atomic Amenity Reservations
        if (request.getAmenityIds() != null) {
            for (Long amenityId : request.getAmenityIds()) {
                amenityReservationService.reserveAmenity(savedBooking.getId(), amenityId);
            }
        }

        return savedBooking;
    }

    @Transactional
    public Booking updateBooking(Long bookingId, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getBookingStatus() == BookingStatus.COMPLETED || booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Cannot modify completed or cancelled bookings.");
        }

        booking.setBookingDate(bookingDetails.getBookingDate());
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        
        validateBookingDuration(booking);
        checkOverlap(booking);

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking checkIn(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getBookingStatus() != BookingStatus.CONFIRMED) {
            throw new RuntimeException("Can only check-in to confirmed bookings.");
        }

        booking.setBookingStatus(BookingStatus.IN_USE);
        
        Desk desk = booking.getDesk();
        desk.setAvailabilityStatus(DeskStatus.OCCUPIED);
        deskRepository.save(desk);
        
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking checkOut(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setBookingStatus(BookingStatus.COMPLETED);
        
        Desk desk = booking.getDesk();
        desk.setAvailabilityStatus(DeskStatus.AVAILABLE);
        deskRepository.save(desk);
        
        // Release associated amenities
        amenityReservationService.releaseAmenitiesByBooking(bookingId);
        
        return bookingRepository.save(booking);
    }

    private void validateBookingDuration(Booking booking) {
        long hours = Duration.between(booking.getStartTime(), booking.getEndTime()).toHours();
        if (hours < 1 || hours > 12) {
            throw new RuntimeException("Booking duration must be between 1 and 12 hours.");
        }

        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new RuntimeException("End time must be after start time.");
        }
    }

    private void checkOverlap(Booking booking) {
        boolean isOverlapping = bookingRepository.existsOverlappingBooking(
                booking.getDesk().getId(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                Arrays.asList(BookingStatus.CANCELLED, BookingStatus.COMPLETED),
                booking.getId() != null ? booking.getId() : -1L
        );

        if (isOverlapping) {
            throw new RuntimeException("The desk is already booked for the selected time slot.");
        }
    }

    @Transactional
    public Booking confirmBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setBookingStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        
        // Release Desk availability
        Desk desk = booking.getDesk();
        desk.setAvailabilityStatus(DeskStatus.AVAILABLE);
        deskRepository.save(desk);
        
        // Release associated amenities
        amenityReservationService.releaseAmenitiesByBooking(bookingId);
        
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
