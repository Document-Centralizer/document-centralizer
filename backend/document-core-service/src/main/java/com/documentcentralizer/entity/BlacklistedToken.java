package com.documentcentralizer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.util.Date;

@Entity
@Table(name = "blacklisted_tokens")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlacklistedToken extends BaseEntity {

    @Column(nullable = false, unique = true, length = 1024)
    private String token;

    @Column(nullable = false)
    private Date expiryDate;
}
