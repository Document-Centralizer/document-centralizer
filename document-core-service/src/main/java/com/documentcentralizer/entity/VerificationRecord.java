package com.documentcentralizer.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "verification_records")
@Getter
@Setter
@NoArgsConstructor
public class VerificationRecord extends BaseEntity {

    // The document being verified
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    // The admin user who did the verification
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_user_id", nullable = false)
    private User verifiedBy;

    // Status like "VERIFIED", "REJECTED"
    @Column(nullable = false, length = 50)
    private String status;

    @Column(length = 255)
    private String remarks;

    @Column(length = 255)
    private String rejectionReason;

}
