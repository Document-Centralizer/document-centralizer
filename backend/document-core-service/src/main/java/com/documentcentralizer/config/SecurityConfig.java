package com.documentcentralizer.config;

import com.documentcentralizer.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

/**
 * SecurityConfig handles all the security configurations for the application.
 * It manages authentication (verifying who the user is) and authorization (verifying what the user can do).
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables method-level security like @PreAuthorize
public class SecurityConfig {

    private final UserDetailsService customUserDetailsService;
    
    // Injecting the custom JwtFilter
    private final JwtFilter jwtFilter;

    /**
     * Constructor injection for required dependencies.
     * We inject CustomUserDetailsService (which loads user data from the database)
     * and JwtFilter (which intercepts requests to check the JWT token).
     */
    public SecurityConfig(UserDetailsService customUserDetailsService, JwtFilter jwtFilter) {
        this.customUserDetailsService = customUserDetailsService;
        this.jwtFilter = jwtFilter;
    }


    /**
     * Creates the AuthenticationManager bean.
     * Spring Security uses this manager to authenticate a user's login request.
     * It takes the username and password, passes it to the AuthenticationProvider, 
     * and returns a successful authentication object or throws an error.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * Configures the DaoAuthenticationProvider.
     * This provider connects the AuthenticationManager with our database.
     * It tells Spring Security: "Use customUserDetailsService to find the user in the database, 
     * and use passwordEncoder to verify the password matches."
     */
    @Bean
    public AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    /**
     * Configures the SecurityFilterChain.
     * This is the most important method where we define which APIs are public and which are secured.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationProvider authenticationProvider) throws Exception {
        
        // 1. Enable CORS using our custom configuration source
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 2. Disable CSRF (Cross-Site Request Forgery) for stateless APIs
        http.csrf(csrf -> csrf.disable());

        // 3. Configure HTTP Requests Authorization
        http.authorizeHttpRequests(auth -> auth
                // Allow public access to authentication endpoints (login, register)
                .requestMatchers("/api/auth/**").permitAll()
                // Allow public access to document sharing
                .requestMatchers("/api/documents/share/**").permitAll()
                // Allow public access to Swagger UI and API documentation
                .requestMatchers(
                        "/swagger-ui/**",
                        "/swagger-ui.html",
                        "/v3/api-docs/**",
                        "/swagger-resources/**",
                        "/webjars/**",
                        "/error"
                ).permitAll()
                // All other requests must be authenticated (user must provide a valid JWT)
                .anyRequest().authenticated()
        );

        // 3. Configure Stateless Session Management
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 4. Register the Authentication Provider
        // We tell HttpSecurity to use our configured DaoAuthenticationProvider
        http.authenticationProvider(authenticationProvider);

        // 5. Register JWT Filter before UsernamePasswordAuthenticationFilter
        // Adding the JwtFilter into the filter chain
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the configured security chain
        return http.build();
    }

    /**
     * Configures CORS (Cross-Origin Resource Sharing).
     * This tells the browser that it is safe for our frontend (e.g., localhost:5173 or localhost:3000)
     * to make requests to this backend, and specifically allows the Authorization header.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow your frontend domain(s)
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        
        // Allow all standard HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow important headers, especially Authorization for our JWT
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        
        // Apply this configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}