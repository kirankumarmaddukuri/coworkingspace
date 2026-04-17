package com.guvi.coworking.controller;

import com.guvi.coworking.model.Desk;
import com.guvi.coworking.service.DeskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/desks")
public class DeskController {

    @Autowired
    private DeskService deskService;

    @PostMapping
    @PreAuthorize("hasRole('SPACE_MANAGER')")
    public ResponseEntity<Desk> createDesk(@RequestParam Long workspaceId, @Valid @RequestBody com.guvi.coworking.dto.request.DeskRequest deskRequest) {
        return ResponseEntity.ok(deskService.createDesk(workspaceId, deskRequest));
    }

    @GetMapping
    public ResponseEntity<List<Desk>> getDesksByWorkspace(@RequestParam Long workspaceId) {
        return ResponseEntity.ok(deskService.getDesksByWorkspace(workspaceId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Desk> getDeskById(@PathVariable Long id) {
        return deskService.getDeskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('SPACE_MANAGER')")
    public ResponseEntity<Desk> updateDeskStatus(@PathVariable Long id, @RequestParam com.guvi.coworking.model.DeskStatus status) {
        return ResponseEntity.ok(deskService.updateDeskStatus(id, status));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SPACE_MANAGER')")
    public ResponseEntity<Desk> updateDesk(@PathVariable Long id, @Valid @RequestBody com.guvi.coworking.dto.request.DeskRequest deskRequest) {
        return ResponseEntity.ok(deskService.updateDesk(id, deskRequest));
    }
}
