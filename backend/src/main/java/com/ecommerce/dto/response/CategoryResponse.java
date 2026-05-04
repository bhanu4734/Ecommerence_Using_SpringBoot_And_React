package com.ecommerce.dto.response;

import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private int productCount;
}
