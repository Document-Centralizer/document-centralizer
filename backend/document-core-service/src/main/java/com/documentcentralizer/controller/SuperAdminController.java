package com.documentcentralizer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 * Class Name : SuperAdminController
 *
 * Purpose:
 * Exposes REST API endpoints for Super Admin operations.
 *
 * Responsibility:
 * - Handle high-level system management tasks
 * - Note: This is a stub implementation created for Swagger documentation purposes.
 *
 * Author:
 * CDAC Project
 */
@RestController
@RequestMapping("/api/super-admin")
public class SuperAdminController {

    @GetMapping("/users")
    public ResponseEntity<?> manageUsers() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admins")
    public ResponseEntity<?> manageAdmins() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getReports() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        return ResponseEntity.ok().build();
    }
}
