package com.faite_assessment.backend.Services;

import com.faite_assessment.backend.Entities.User;
import com.faite_assessment.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.faite_assessment.backend.Dtos.DashboardStats;
import com.faite_assessment.backend.Repositories.OrderRepository;
import com.faite_assessment.backend.Repositories.ProductRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public DashboardStats getUserStats(String email) {
        Double revenue = orderRepository.calculateTotalRevenue(email);
        long products = productRepository.countByUserEmail(email);
        long sold = orderRepository.countBySellerEmailAndStatusNot(email, "CANCELLED");
        long pending = orderRepository.countBySellerEmailAndStatus(email, "PENDING");
        long bought = orderRepository.countByBuyerEmail(email);

        return DashboardStats.builder()
                .totalRevenue(revenue != null ? revenue : 0.0)
                .productsListed(products)
                .itemsSold(sold)
                .pendingOrders(pending)
                .itemsBought(bought)
                .build();
    }


}
