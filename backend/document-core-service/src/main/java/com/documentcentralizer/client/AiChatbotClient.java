package com.documentcentralizer.client;

/**
 * Purpose:
 * Defines the interface for HTTP communication with the Python AI Chatbot Service.
 * 
 * Responsibility:
 * Sends user queries to the AI microservice and receives the chatbot's response.
 * Do NOT implement chatbot logic here, only HTTP communication.
 * 
 * Usage:
 * Inject this interface into the relevant Chatbot service or controller to forward queries.
 * 
 * Author:
 * CDAC Project
 */
public interface AiChatbotClient {
    
    /**
     * Purpose:
     * Calls the external Python AI Chatbot API to get an AI-generated response.
     * 
     * Input:
     * String containing the user's message/query.
     * 
     * Output:
     * String containing the AI's response text.
     * 
     * Processing:
     * Performs a REST call to the AI chatbot microservice.
     */
    String processChatQuery(String userQuery);
}
