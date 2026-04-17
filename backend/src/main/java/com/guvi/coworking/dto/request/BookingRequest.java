package com.guvi.coworking.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class BookingRequest {
    @NotNull
    private Long deskId;
    
    @NotNull
    private LocalDate bookingDate;
    
    @NotNull
    private LocalTime startTime;
    
    @NotNull
    private LocalTime endTime;
    
    private List<Long> amenityIds;

    public BookingRequest() {}

    public BookingRequest(@NotNull Long deskId, @NotNull LocalDate bookingDate, @NotNull LocalTime startTime, @NotNull LocalTime endTime, List<Long> amenityIds) {
        this.deskId = deskId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.amenityIds = amenityIds;
    }

    public @NotNull Long getDeskId() {
        return deskId;
    }

    public void setDeskId(@NotNull Long deskId) {
        this.deskId = deskId;
    }

    public @NotNull LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(@NotNull LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public @NotNull LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(@NotNull LocalTime startTime) {
        this.startTime = startTime;
    }

    public @NotNull LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(@NotNull LocalTime endTime) {
        this.endTime = endTime;
    }

    public List<Long> getAmenityIds() {
        return amenityIds;
    }

    public void setAmenityIds(List<Long> amenityIds) {
        this.amenityIds = amenityIds;
    }
}
