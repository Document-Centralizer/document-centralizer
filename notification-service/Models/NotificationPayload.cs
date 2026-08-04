namespace notification_service.Models
{
    /*
     * Class Name: NotificationPayload
     * Purpose: This is a Data Transfer Object (DTO). 
     * It exactly matches the JSON data structure that the Java Spring Boot backend will send us.
     */
    public class NotificationPayload
    {
        public required string UserEmail { get; set; }
        public required string UserPhone { get; set; }
        public required string UserName { get; set; }
        public required string DocumentName { get; set; }
        public required string Status { get; set; }  // "VERIFIED" or "REJECTED"
        public string? Remarks { get; set; }         // e.g. "Image is too blurry"
    }
}
