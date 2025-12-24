package com.faite_assessment.backend.Repositories;

import com.faite_assessment.backend.Entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find orders where I am the buyer
    List<Order> findByBuyerEmail(String email);

    // Find orders where I am the seller (so I can see who bought my stuff)
    List<Order> findBySellerEmail(String email);


    @Query("SELECT SUM(p.price) FROM Order o JOIN o.product p WHERE o.seller.email = :email AND o.status != 'CANCELLED'")
    Double calculateTotalRevenue(String email);


    long countBySellerEmailAndStatusNot(String email, String status);


    long countBySellerEmailAndStatus(String email, String status);


    long countByBuyerEmail(String email);
}