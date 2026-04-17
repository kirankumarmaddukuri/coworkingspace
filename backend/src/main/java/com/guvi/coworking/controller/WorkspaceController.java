package com.guvi.coworking.controller;

import com.guvi.coworking.model.Workspace;
import com.guvi.coworking.service.WorkspaceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    @Autowired
    private WorkspaceService workspaceService;

    @PostMapping
    @PreAuthorize("hasRole('SPACE_MANAGER')")
    public ResponseEntity<Workspace> createWorkspace(@Valid @RequestBody Workspace workspace) {
        return ResponseEntity.ok(workspaceService.createWorkspace(workspace));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MEMBER') or hasRole('SPACE_MANAGER')")
    public ResponseEntity<List<Workspace>> getAllWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAllWorkspaces());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Workspace> getWorkspaceById(@PathVariable Long id) {
        return workspaceService.getWorkspaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public ResponseEntity<List<Workspace>> getAvailableWorkspaces() {
        return ResponseEntity.ok(workspaceService.getAvailableWorkspaces());
    }
}
