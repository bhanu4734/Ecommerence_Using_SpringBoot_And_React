package com.ecommerce.config;

import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping.");
            return;
        }

        log.info("Seeding sample data...");

        // Users
        userRepository.save(User.builder()
                .name("Admin User").email("admin@ecommerce.com")
                .password("admin123").role(User.Role.ADMIN)
                .phone("9876543210").address("123 Admin St, Mumbai").build());

        userRepository.save(User.builder()
                .name("John Doe").email("john@example.com")
                .password("john123").role(User.Role.CUSTOMER)
                .phone("9876501234").address("456 Customer Ave, Bangalore").build());

        // Categories
        Category electronics = categoryRepository.save(Category.builder()
                .name("Electronics")
                .description("Gadgets, devices, and tech accessories")
                .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400").build());

        Category clothing = categoryRepository.save(Category.builder()
                .name("Clothing")
                .description("Men's and Women's fashion")
                .imageUrl("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400").build());

        Category books = categoryRepository.save(Category.builder()
                .name("Books")
                .description("Fiction, non-fiction, and educational books")
                .imageUrl("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400").build());

        Category home = categoryRepository.save(Category.builder()
                .name("Home & Kitchen")
                .description("Furniture, appliances, and kitchen essentials")
                .imageUrl("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400").build());

        // Products
        productRepository.saveAll(List.of(
            Product.builder().name("iPhone 15 Pro").description("Apple iPhone 15 Pro with A17 chip, 256GB storage")
                .price(new BigDecimal("129999")).stockQuantity(50).brand("Apple").category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400").build(),

            Product.builder().name("Samsung Galaxy S24").description("Samsung Galaxy S24 Ultra, 512GB, Titanium Black")
                .price(new BigDecimal("109999")).stockQuantity(40).brand("Samsung").category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400").build(),

            Product.builder().name("Sony WH-1000XM5").description("Industry-leading noise-canceling wireless headphones")
                .price(new BigDecimal("29999")).stockQuantity(100).brand("Sony").category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400").build(),

            Product.builder().name("MacBook Air M3").description("Apple MacBook Air with M3 chip, 16GB RAM, 512GB SSD")
                .price(new BigDecimal("149999")).stockQuantity(25).brand("Apple").category(electronics)
                .imageUrl("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400").build(),

            Product.builder().name("Men's Classic Polo").description("Premium cotton polo shirt for everyday wear")
                .price(new BigDecimal("1499")).stockQuantity(200).brand("Lacoste").category(clothing)
                .imageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400").build(),

            Product.builder().name("Women's Floral Dress").description("Elegant floral summer dress with belt")
                .price(new BigDecimal("2499")).stockQuantity(150).brand("Zara").category(clothing)
                .imageUrl("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400").build(),

            Product.builder().name("Denim Jacket").description("Classic blue denim jacket unisex fit")
                .price(new BigDecimal("3499")).stockQuantity(80).brand("Levi's").category(clothing)
                .imageUrl("https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400").build(),

            Product.builder().name("Atomic Habits").description("An Easy & Proven Way to Build Good Habits & Break Bad Ones")
                .price(new BigDecimal("499")).stockQuantity(300).brand("Penguin").category(books)
                .imageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400").build(),

            Product.builder().name("The Pragmatic Programmer").description("Your Journey to Mastery, 20th Anniversary Edition")
                .price(new BigDecimal("799")).stockQuantity(120).brand("O'Reilly").category(books)
                .imageUrl("https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400").build(),

            Product.builder().name("Instant Pot Duo 7-in-1").description("Electric pressure cooker, 6 quart, 7 one-touch programs")
                .price(new BigDecimal("8999")).stockQuantity(60).brand("Instant Pot").category(home)
                .imageUrl("https://images.unsplash.com/photo-1585515320310-259814833e62?w=400").build(),

            Product.builder().name("Dyson V15 Detect").description("Cordless vacuum cleaner with laser dust detection")
                .price(new BigDecimal("49999")).stockQuantity(30).brand("Dyson").category(home)
                .imageUrl("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400").build(),

            Product.builder().name("Air Purifier HEPA").description("True HEPA air purifier for rooms up to 500 sq ft")
                .price(new BigDecimal("12999")).stockQuantity(45).brand("Philips").category(home)
                .imageUrl("https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400").build()
        ));

        log.info("Sample data seeded: {} users, {} categories, {} products",
                userRepository.count(), categoryRepository.count(), productRepository.count());
    }
}
