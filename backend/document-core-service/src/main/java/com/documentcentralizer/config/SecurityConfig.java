package com.documentcentralizer.config;

import com.documentcentralizer.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

/**
 * SecurityConfig handles all the security configurations for the application.
 * It manages authentication (verifying who the user is) and authorization (verifying what the user can do).
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService customUserDetailsService;
    
    // Injecting the JwtFilter created in Task 41
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
     * Creates BCrypt password encoder bean.
     * This encoder encrypts user passwords before storing them in the database.
     * We use BCrypt because passwords should never be stored in plain text.
     * It prevents hackers from reading passwords even if the database is compromised.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
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
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * Configures the SecurityFilterChain.
     * This is the most important method where we define which APIs are public and which are secured.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        
        // 1. Disable CSRF (Cross-Site Request Forgery)
        // Why? Because we are using JWT (tokens) instead of session cookies.
        // CSRF attacks target sessions, so CSRF protection is unnecessary and disabled for stateless APIs.
        http.csrf(csrf -> csrf.disable());

        // 2. Configure HTTP Requests (Authorization)
        // We define which URLs require a token and which are public.
        http.authorizeHttpRequests(auth -> auth
                // Allow public access to authentication endpoints (login, register)
                .requestMatchers("/api/auth/**").permitAll()
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
        // Why? We want our microservices to be stateless. 
        // Instead of the server remembering the user via an HTTP session in server memory,
        // the client will send a JWT token with every request to prove who they are.
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 4. Register the Authentication Provider
        // We tell HttpSecurity to use our configured DaoAuthenticationProvider
        http.authenticationProvider(authenticationProvider());

        // 5. Register JWT Filter
        // Why add it before UsernamePasswordAuthenticationFilter?
        // UsernamePasswordAuthenticationFilter is Spring's default filter for form login.
        // We want to intercept the request and check for our JWT token FIRST.
        // If the token is valid, we manually set the user as logged in, bypassing the need for form login.
        
        // Adding the JwtFilter created in Task 41 into the filter chain
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Build and return the configured security chain
        return http.build();
    }
}