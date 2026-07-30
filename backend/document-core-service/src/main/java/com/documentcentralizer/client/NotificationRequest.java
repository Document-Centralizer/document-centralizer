package com.documentcentralizer.client;

/**
 * Purpose:
 * Represents the request payload for the Notification service.
 * 
 * Responsibility:
 * Holds recipient details and message content.
 * 
 * Usage:
 * Passed to NotificationClient to send emails or SMS.
 * 
 * Author:
 * CDAC Project
 */
public class NotificationRequest {
    private String to;
    private String subject;
    private String message;

    public NotificationRequest() {}

    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
