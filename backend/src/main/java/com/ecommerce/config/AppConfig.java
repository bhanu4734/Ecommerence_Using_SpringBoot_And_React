package com.ecommerce.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("E-Commerce REST API")
                        .version("1.0.0")
                        .description("Production-ready E-Commerce backend API built with Spring Boot 3")
                        .contact(new Contact().name("E-Commerce Team").email("support@ecommerce.com"))
                        .license(new License().name("MIT").url("https://opensource.org/licenses/MIT")));
    }
}
