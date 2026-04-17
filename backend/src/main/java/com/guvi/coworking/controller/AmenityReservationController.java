package com.guvi.coworking.controller;

import com.guvi.coworking.model.AmenityReservation;
import com.guvi.coworking.service.AmenityReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/amenity-reservations")
public class AmenityReservationController {

    @Autowired
    private AmenityReservationService reservationService;

    @PostMapping
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<AmenityReservation> reserveAmenity(@RequestParam Long bookingId, @RequestParam Long amenityId) {
        return ResponseEntity.ok(reservationService.reserveAmenity(bookingId, amenityId));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AmenityReservation> approveReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.approveReservation(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AmenityReservation> rejectReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.rejectReservation(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<AmenityReservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<AmenityReservation>> getReservationsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(reservationService.getReservationsByBooking(bookingId));
    }
}
