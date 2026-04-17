package com.guvi.coworking.repository;

import com.guvi.coworking.model.Amenity;
import com.guvi.coworking.model.AmenityStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {
    List<Amenity> findByAvailabilityStatus(AmenityStatus status);
}
