package com.faite_assessment.backend.Dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardStats {
    private Double totalRevenue;    // Total money earned from sales
    private long productsListed;    // Total active products
    private long itemsSold;         // Count of items sold
    private long pendingOrders;     // Orders waiting to be shipped
    private long itemsBought;       // Items I bought
}