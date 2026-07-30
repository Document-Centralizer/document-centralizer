package com.documentcentralizer.dto;

import com.documentcentralizer.entity.Role;
import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;
    private String username;
    private String dob;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String profileImageUrl;
    private Role role;
}
