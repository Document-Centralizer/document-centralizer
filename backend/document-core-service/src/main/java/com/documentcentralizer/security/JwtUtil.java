package com.documentcentralizer.security;

import com.documentcentralizer.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expirationMillis;

    private Key signingKey;

    /**
     * Initializes the signing key for JWT using the secret string.
     * This runs automatically after dependency injection.
     */
    @PostConstruct
    public void init() {
        // Convert secret string to Key object
        signingKey = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    /**
     * Builds and signs a JWT after successful authentication.
     * It extracts user ID and roles to store inside the token.
     */
    public String createToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        
        // Extract user info
        String userId = String.valueOf(user.getId());
        String roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));
        
        // Build JWT
        return Jwts.builder()
                .setSubject(userId)           // User identifier
                .claim("roles", roles)        // Custom claim
                .setIssuedAt(new Date())      // Creation time
                .setExpiration(new Date(System.currentTimeMillis() + expirationMillis)) // Expiry
                .signWith(signingKey, SignatureAlgorithm.HS256) // Sign with secret
                .compact();                   // Generate token string
    }

    /**
     * Parses and validates incoming JWT.
     * Recreates the Authentication object from token claims if valid.
     */
    public Authentication validateToken(String token) {
        try {
            // Parse and verify signature
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(signingKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            // Extract claims
            String userId = claims.getSubject();
            String roles = claims.get("roles", String.class);
            
            // Convert roles to authorities
            List<GrantedAuthority> authorities = AuthorityUtils.commaSeparatedStringToAuthorityList(roles);
            
            // Create Authentication object
            return new UsernamePasswordAuthenticationToken(userId, null, authorities);
        } catch (JwtException e) {
            // Invalid token
            return null;
        }
    }
    public Date extractExpiration(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getExpiration();
    }
}
