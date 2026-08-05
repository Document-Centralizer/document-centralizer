package com.documentcentralizer.config;

import com.documentcentralizer.entity.Role;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if admin already exists
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setFirstName("System");
            admin.setLastName("Admin");
            admin.setEmail("admin@example.com");
            admin.setMobileNumber("0000000000");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);

            userRepository.save(admin);
            System.out.println("=========================================================");
            System.out.println("Default Admin created: admin@example.com / admin123");
            System.out.println("=========================================================");
        }

        // Check if super admin already exists
        if (!userRepository.existsByEmail("superadmin@example.com")) {
            User superAdmin = new User();
            superAdmin.setFirstName("System");
            superAdmin.setLastName("SuperAdmin");
            superAdmin.setEmail("superadmin@example.com");
            superAdmin.setMobileNumber("0000000001");
            superAdmin.setPassword(passwordEncoder.encode("superadmin123"));
            superAdmin.setRole(Role.SUPER_ADMIN);
            superAdmin.setEnabled(true);

            userRepository.save(superAdmin);
            System.out.println("=========================================================");
            System.out.println("Default Super Admin created: superadmin@example.com / superadmin123");
            System.out.println("=========================================================");
        }
    }
}
