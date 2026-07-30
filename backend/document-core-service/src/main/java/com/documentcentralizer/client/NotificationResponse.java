package com.documentcentralizer.client;

/**
 * Purpose:
 * Represents the response from the Notification service.
 * 
 * Responsibility:
 * Holds the status of the notification dispatch.
 * 
 * Usage:
 * Returned by NotificationClient.
 * 
 * Author:
 * CDAC Project
 */
public class NotificationResponse {
    private boolean success;
    private String message;

    public NotificationResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
