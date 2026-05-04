package com.ecommerce.service.impl;

import com.ecommerce.dto.request.ProductRequest;
import com.ecommerce.dto.response.ProductResponse;
import com.ecommerce.entity.Category;
import com.ecommerce.entity.Product;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor @Slf4j @Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    @Override
    public ProductResponse createProduct(ProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .imageUrl(request.getImageUrl())
                .brand(request.getBrand())
                .active(request.getActive())
                .category(category)
                .build();
        return toResponse(productRepository.save(product));
    }

    @Override @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id)));
    }

    @Override @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    @Override @Transactional(readOnly = true)
    public Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toResponse);
    }

    @Override @Transactional(readOnly = true)
    public Page<ProductResponse> searchProducts(String keyword, Long categoryId, Pageable pageable) {
        if (categoryId != null && keyword != null) {
            return productRepository.searchByKeywordAndCategory(keyword, categoryId, pageable).map(this::toResponse);
        } else if (keyword != null) {
            return productRepository.searchProducts(keyword, pageable).map(this::toResponse);
        } else if (categoryId != null) {
            return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable).map(this::toResponse);
        }
        return productRepository.findByActiveTrue(pageable).map(this::toResponse);
    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        product.setBrand(request.getBrand());
        product.setActive(request.getActive());
        product.setCategory(category);
        return toResponse(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
        product.setActive(false);
        productRepository.save(product);
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse r = modelMapper.map(p, ProductResponse.class);
        r.setCategoryId(p.getCategory().getId());
        r.setCategoryName(p.getCategory().getName());
        return r;
    }
}
