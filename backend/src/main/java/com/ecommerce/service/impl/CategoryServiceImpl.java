package com.ecommerce.service.impl;

import com.ecommerce.dto.request.CategoryRequest;
import com.ecommerce.dto.response.CategoryResponse;
import com.ecommerce.entity.Category;
import com.ecommerce.exception.BusinessException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new BusinessException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(categoryRepository.save(category));
    }

    @Override @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        return toResponse(categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id)));
    }

    @Override @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        cat.setName(request.getName());
        cat.setDescription(request.getDescription());
        cat.setImageUrl(request.getImageUrl());
        return toResponse(categoryRepository.save(cat));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) throw new ResourceNotFoundException("Category", id);
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category c) {
        CategoryResponse r = modelMapper.map(c, CategoryResponse.class);
        r.setProductCount(c.getProducts().size());
        return r;
    }
}
