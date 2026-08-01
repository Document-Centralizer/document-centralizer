package com.documentcentralizer.task;

import com.documentcentralizer.repository.BlacklistedTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupTask {

    private final BlacklistedTokenRepository blacklistedTokenRepository;

    /**
     * Runs once every day at 2:00 AM to delete expired tokens from the blacklist.
     * This keeps the database small.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanExpiredBlacklistedTokens() {
        log.info("Starting cleanup of expired blacklisted tokens...");
        blacklistedTokenRepository.deleteByExpiryDateBefore(new Date());
        log.info("Cleanup of expired blacklisted tokens completed.");
    }
}
