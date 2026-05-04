package com.ecommerce.service;

import com.ecommerce.dto.request.UserRequest;
import com.ecommerce.dto.response.UserResponse;
import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    UserResponse getUserById(Long id);
    List<UserResponse> getAllUsers();
    UserResponse updateUser(Long id, UserRequest request);
    void deleteUser(Long id);
}
