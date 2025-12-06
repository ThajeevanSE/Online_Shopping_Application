package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.ActivityLog;
import com.faite_assessment.backend.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findByUserOrderByCreatedAtDesc(User user);
}
