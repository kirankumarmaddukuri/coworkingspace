package com.guvi.coworking.repository;

import com.guvi.coworking.model.Booking;
import com.guvi.coworking.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    @Query("SELECT COUNT(b) > 0 FROM Booking b " +
           "WHERE b.desk.id = :deskId " +
           "AND b.bookingDate = :date " +
           "AND b.bookingStatus NOT IN :excludedStatuses " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime " +
           "AND b.id <> :bookingId")
    boolean existsOverlappingBooking(
        @Param("deskId") Long deskId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("excludedStatuses") List<BookingStatus> excludedStatuses,
        @Param("bookingId") Long bookingId);

    @Query("SELECT b.desk.workspace.workspaceName, COUNT(b) FROM Booking b GROUP BY b.desk.workspace.workspaceName")
    List<Object[]> countBookingsByWorkspace();

    @Query("SELECT COUNT(b) * 100.0 / (SELECT COUNT(d) FROM Desk d) FROM Booking b WHERE b.bookingStatus = 'CONFIRMED' OR b.bookingStatus = 'IN_USE'")
    Double getOverallDeskUtilization();
}
