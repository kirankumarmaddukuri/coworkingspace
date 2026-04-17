package com.guvi.coworking.repository;

import com.guvi.coworking.model.Workspace;
import com.guvi.coworking.model.WorkspaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByStatus(WorkspaceStatus status);
}
