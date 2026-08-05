package com.documentcentralizer.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.documentcentralizer.entity.User;
import com.documentcentralizer.repository.UserRepository;
import com.documentcentralizer.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller to handle Razorpay Payments for Premium Subscription
 */
@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpaySecret;

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public PaymentController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestHeader("Authorization") String token) {
        try {
            // Initialize Razorpay Client
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpaySecret);

            // Create Order Request for Premium Plan (e.g. ₹99.00)
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", 9900); // Amount must be in paise (99.00 INR)
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "receipt_premium_" + System.currentTimeMillis());

            // Generate Order ID from Razorpay Server
            Order order = razorpay.orders.create(orderRequest);

            // Return Order Details to Frontend
            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("amount", order.get("amount"));
            response.put("currency", order.get("currency"));
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error while creating Razorpay order: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestHeader("Authorization") String token, @RequestBody Map<String, String> data) {
        try {
            String razorpayOrderId = data.get("razorpay_order_id");
            String razorpayPaymentId = data.get("razorpay_payment_id");
            String razorpaySignature = data.get("razorpay_signature");

            // Verify the cryptographic signature using Razorpay's official utility
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isSignatureValid = Utils.verifyPaymentSignature(options, razorpaySecret);

            if (isSignatureValid) {
                // Extract userId from JWT token
                String jwt = token.substring(7);
                org.springframework.security.core.Authentication auth = jwtUtil.validateToken(jwt);
                
                if (auth == null) {
                    throw new RuntimeException("Invalid token");
                }
                
                Long userId = Long.parseLong((String) auth.getPrincipal());

                // Find user and upgrade them to Premium!
                User user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                user.setIsPremium(true);
                user.setSubscriptionPlan("Premium");
                userRepository.save(user);

                Map<String, Object> response = new HashMap<>();
                response.put("status", "SUCCESS");
                response.put("message", "Payment verified successfully. Welcome to Premium!");
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("status", "FAILED");
                response.put("message", "Payment signature verification failed. Possible tampering detected.");
                return ResponseEntity.status(400).body(response);
            }
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Error verifying payment: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
