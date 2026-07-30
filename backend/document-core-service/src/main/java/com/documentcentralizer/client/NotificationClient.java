package com.documentcentralizer.client;

/**
 * Purpose:
 * Defines the interface for HTTP communication with the .NET Notification Service.
 * 
 * Responsibility:
 * Sends email or SMS requests to the notification microservice.
 * Do NOT write notification logic here, only HTTP communication.
 * 
 * Usage:
 * Inject this interface into UserService or SubscriptionService.
 * 
 * Author:
 * CDAC Project
 */
public interface NotificationClient {
    
    /**
     * Purpose:
     * Calls the external .NET Notification API to send an email or SMS.
     * 
     * Input:
     * NotificationRequest containing recipient and message.
     * 
     * Output:
     * NotificationResponse containing the success status.
     * 
     * Processing:
     * Performs a REST call to the notification microservice.
     */
    NotificationResponse sendNotification(NotificationRequest request);
}
