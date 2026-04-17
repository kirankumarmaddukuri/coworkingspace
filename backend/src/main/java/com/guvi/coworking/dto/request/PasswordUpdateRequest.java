package com.guvi.coworking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PasswordUpdateRequest {
    @NotBlank
    private String currentPassword;

    @NotBlank
    @Size(min = 6, max = 40)
    private String newPassword;

    public PasswordUpdateRequest() {}

    public PasswordUpdateRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }

    public @NotBlank String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(@NotBlank String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public @NotBlank @Size(min = 6, max = 40) String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(@NotBlank @Size(min = 6, max = 40) String newPassword) {
        this.newPassword = newPassword;
    }
}
