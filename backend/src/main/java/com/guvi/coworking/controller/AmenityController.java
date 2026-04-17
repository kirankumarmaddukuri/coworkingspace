package com.guvi.coworking.controller;

import com.guvi.coworking.model.Amenity;
import com.guvi.coworking.model.AmenityStatus;
import com.guvi.coworking.service.AmenityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/amenities")
public class AmenityController {

    @Autowired
    private AmenityService amenityService;

    @PostMapping
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Amenity> createAmenity(@Valid @RequestBody Amenity amenity) {
        return ResponseEntity.ok(amenityService.createAmenity(amenity));
    }

    @GetMapping
    public ResponseEntity<List<Amenity>> getAllAmenities() {
        return ResponseEntity.ok(amenityService.getAllAmenities());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Amenity>> getAvailableAmenities() {
        return ResponseEntity.ok(amenityService.getAvailableAmenities());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SPACE_MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Amenity> updateAmenityStatus(@PathVariable Long id, @RequestParam AmenityStatus status) {
        return ResponseEntity.ok(amenityService.updateAmenityStatus(id, status));
    }
}
