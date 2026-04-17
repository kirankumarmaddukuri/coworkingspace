package com.guvi.coworking.controller;

import com.guvi.coworking.repository.AmenityReservationRepository;
import com.guvi.coworking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AmenityReservationRepository amenityReservationRepository;

    @GetMapping("/booking-stats")
    public ResponseEntity<?> getBookingStats() {
        List<Object[]> stats = bookingRepository.countBookingsByWorkspace();
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : stats) {
            result.put((String) row[0], (Long) row[1]);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/amenity-stats")
    public ResponseEntity<?> getAmenityStats() {
        List<Object[]> stats = amenityReservationRepository.findAmenityUsageStats();
        Map<String, Long> result = new HashMap<>();
        for (Object[] row : stats) {
            result.put((String) row[0], (Long) row[1]);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/utilization")
    public ResponseEntity<?> getUtilization() {
        Double utilization = bookingRepository.getOverallDeskUtilization();
        Map<String, Double> result = new HashMap<>();
        result.put("overallDeskUtilization", utilization != null ? utilization : 0.0);
        return ResponseEntity.ok(result);
    }
}
