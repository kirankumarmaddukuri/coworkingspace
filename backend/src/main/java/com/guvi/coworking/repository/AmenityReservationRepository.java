package com.guvi.coworking.repository;

import com.guvi.coworking.model.AmenityReservation;
import com.guvi.coworking.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmenityReservationRepository extends JpaRepository<AmenityReservation, Long> {
    List<AmenityReservation> findByBookingId(Long bookingId);

    @Query("SELECT r.amenity.amenityName, COUNT(r) as usageCount FROM AmenityReservation r GROUP BY r.amenity.amenityName ORDER BY usageCount DESC")
    List<Object[]> findAmenityUsageStats();

    @Query("SELECT COUNT(r) > 0 FROM AmenityReservation r WHERE r.amenity.id = :amenityId " +
           "AND r.reservationDate = :date " +
           "AND r.reservationStatus NOT IN :excludedStatuses " +
           "AND ((r.startTime < :endTime AND r.endTime > :startTime))")
    boolean existsOverlappingReservation(
        @Param("amenityId") Long amenityId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("excludedStatuses") Collection<ReservationStatus> excludedStatuses
    );
}
