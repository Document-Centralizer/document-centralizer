package com.documentcentralizer.repository;

import com.documentcentralizer.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Repository
public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken, Long> {
    
    boolean existsByToken(String token);

    @Transactional
    void deleteByExpiryDateBefore(Date date);
}
