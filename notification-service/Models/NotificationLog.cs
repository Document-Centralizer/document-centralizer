using System;

namespace notification_service.Models
{
    /*
     * Class Name: NotificationLog
     * Purpose: Represents the data model for our notification history.
     * This class directly maps to the 'NotificationLogs' table in the MySQL database.
     */
    public class NotificationLog
    {
        // Primary Key for the table. It auto-increments automatically.
        public int Id { get; set; }

        // The email address of the user receiving the notification.
        // 'required' means this field cannot be null when creating an object.
        public required string UserEmail { get; set; }

        // The phone number of the user for SMS notifications.
        public required string UserPhone { get; set; }

        // The name of the document that was verified or rejected.
        public required string DocumentName { get; set; }

        // The status of the document (e.g., "VERIFIED" or "REJECTED").
        public required string Status { get; set; }

        // Optional remarks from the admin, usually used when a document is rejected.
        // The '?' means this field can be null in the database.
        public string? Remarks { get; set; }

        // The exact date and time the notification was sent.
        // It defaults to the current UTC time.
        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
