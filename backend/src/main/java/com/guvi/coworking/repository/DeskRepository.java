package com.guvi.coworking.repository;

import com.guvi.coworking.model.Desk;
import com.guvi.coworking.model.DeskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeskRepository extends JpaRepository<Desk, Long> {
    List<Desk> findByWorkspaceId(Long workspaceId);
    List<Desk> findByWorkspaceIdAndAvailabilityStatus(Long workspaceId, DeskStatus status);
}
