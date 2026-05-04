package com.ecommerce.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String role;
    private LocalDateTime createdAt;
}
