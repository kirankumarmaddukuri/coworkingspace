package com.guvi.coworking.dto.request;

import com.guvi.coworking.model.DeskStatus;
import com.guvi.coworking.model.DeskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DeskRequest {
    @NotBlank
    private String deskNumber;

    @NotNull
    private DeskType deskType;

    private DeskStatus availabilityStatus;
}
