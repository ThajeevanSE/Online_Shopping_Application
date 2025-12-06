package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.ActivityLog;
import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    public void log(User user, String action) {
        ActivityLog log = ActivityLog.builder()
                .user(user)
                .action(action)
                .build();

        activityLogRepository.save(log);
    }

    public List<ActivityLog> getLogsForUser(User user) {
        return activityLogRepository.findByUserOrderByCreatedAtDesc(user);
    }
}
