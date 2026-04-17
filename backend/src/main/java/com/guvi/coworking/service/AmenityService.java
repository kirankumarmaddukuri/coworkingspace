package com.guvi.coworking.service;

import com.guvi.coworking.model.Amenity;
import com.guvi.coworking.model.AmenityStatus;
import com.guvi.coworking.repository.AmenityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AmenityService {

    @Autowired
    private AmenityRepository amenityRepository;

    public Amenity createAmenity(Amenity amenity) {
        if (amenity.getAvailabilityStatus() == null) {
            amenity.setAvailabilityStatus(AmenityStatus.AVAILABLE);
        }
        return amenityRepository.save(amenity);
    }

    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAll();
    }

    public Optional<Amenity> getAmenityById(Long id) {
        return amenityRepository.findById(id);
    }

    public List<Amenity> getAvailableAmenities() {
        return amenityRepository.findByAvailabilityStatus(AmenityStatus.AVAILABLE);
    }

    public Amenity updateAmenityStatus(Long id, AmenityStatus status) {
        Amenity amenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Amenity not found"));
        amenity.setAvailabilityStatus(status);
        return amenityRepository.save(amenity);
    }
}
