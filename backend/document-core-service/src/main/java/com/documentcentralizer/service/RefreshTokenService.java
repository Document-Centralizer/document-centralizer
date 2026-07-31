package com.documentcentralizer.service;

import com.documentcentralizer.entity.RefreshToken;
import java.util.Optional;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(Long userId);
    RefreshToken verifyExpiration(RefreshToken token);
    Optional<RefreshToken> findByToken(String token);
}
