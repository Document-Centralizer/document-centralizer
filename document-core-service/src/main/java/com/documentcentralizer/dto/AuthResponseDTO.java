package com.documentcentralizer.dto;

import com.documentcentralizer.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
	private String message;

    private String email;

    private Role role;

}
