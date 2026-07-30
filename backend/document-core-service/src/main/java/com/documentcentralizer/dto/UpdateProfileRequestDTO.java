package com.documentcentralizer.dto;

import lombok.Data;

@Data
public class UpdateProfileRequestDTO {
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String address;
    private String city;
    private String state;
    private String country;
    private String pincode;
    private String profileImageUrl;
}
