package com.ecommerce.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponse {
    private Long id;
    private Long orderId;
    private BigDecimal amount;
    private String status;
    private String method;
    private String transactionId;
    private LocalDateTime createdAt;
}
