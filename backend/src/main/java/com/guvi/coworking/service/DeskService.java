package com.guvi.coworking.service;

import com.guvi.coworking.model.Desk;
import com.guvi.coworking.model.DeskStatus;
import com.guvi.coworking.model.Workspace;
import com.guvi.coworking.repository.DeskRepository;
import com.guvi.coworking.repository.WorkspaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DeskService {

    @Autowired
    private DeskRepository deskRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Transactional
    public Desk createDesk(Long workspaceId, com.guvi.coworking.dto.request.DeskRequest deskRequest) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));
        
        Desk desk = Desk.builder()
                .deskNumber(deskRequest.getDeskNumber())
                .deskType(deskRequest.getDeskType())
                .availabilityStatus(deskRequest.getAvailabilityStatus() != null ? deskRequest.getAvailabilityStatus() : DeskStatus.AVAILABLE)
                .workspace(workspace)
                .build();
        
        // Update workspace counts
        workspace.setTotalDesks(workspace.getTotalDesks() + 1);
        workspace.setAvailableDesks(workspace.getAvailableDesks() + 1);
        workspaceRepository.save(workspace);
        
        return deskRepository.save(desk);
    }

    public List<Desk> getDesksByWorkspace(Long workspaceId) {
        return deskRepository.findByWorkspaceId(workspaceId);
    }

    public Optional<Desk> getDeskById(Long id) {
        return deskRepository.findById(id);
    }

    @Transactional
    public Desk updateDeskStatus(Long id, DeskStatus status) {
        Desk desk = deskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Desk not found"));
        desk.setAvailabilityStatus(status);
        return deskRepository.save(desk);
    }

    @Transactional
    public Desk updateDesk(Long id, com.guvi.coworking.dto.request.DeskRequest deskRequest) {
        Desk desk = deskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Desk not found"));
        
        desk.setDeskNumber(deskRequest.getDeskNumber());
        desk.setDeskType(deskRequest.getDeskType());
        if (deskRequest.getAvailabilityStatus() != null) {
            desk.setAvailabilityStatus(deskRequest.getAvailabilityStatus());
        }
        
        return deskRepository.save(desk);
    }
}
