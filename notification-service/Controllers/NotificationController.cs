using Microsoft.AspNetCore.Mvc;
using notification_service.Data;
using notification_service.Models;
using notification_service.Services;
using System.Threading.Tasks;

namespace notification_service.Controllers
{
    /*
     * Class Name: NotificationController
     * Purpose: Exposes the API endpoint that the Java Spring Boot app will call.
     * Route: http://localhost:5000/api/notify
     */
    [ApiController]
    [Route("api/notify")]
    public class NotificationController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ISmsService _smsService;
        private readonly AppDbContext _dbContext;

        // Constructor Injection: We inject our services and database context here.
        public NotificationController(IEmailService emailService, ISmsService smsService, AppDbContext dbContext)
        {
            _emailService = emailService;
            _smsService = smsService;
            _dbContext = dbContext;
        }

        // Endpoint: POST /api/notify
        [HttpPost]
        public async Task<IActionResult> SendNotification([FromBody] NotificationPayload payload)
        {
            // 1. Validate the incoming data
            if (payload == null || string.IsNullOrEmpty(payload.UserEmail))
            {
                return BadRequest("Invalid notification payload.");
            }

            // 2. Prepare the Email Subject and HTML Message Template based on the Status
            string subject = "";
            string htmlMessage = "";
            string smsMessage = "";

            // Convert status to uppercase to avoid case-sensitivity issues (e.g. "rejected" vs "REJECTED")
            string statusUpper = payload.Status.ToUpper();

            if (statusUpper == "VERIFIED")
            {
                subject = "Document Verified Successfully!";
                htmlMessage = $"<h3>Congratulations {payload.UserName},</h3>" +
                              $"<p>Your document <b>'{payload.DocumentName}'</b> has been successfully verified by our administrators.</p>";
                smsMessage = $"Hello {payload.UserName}, your document '{payload.DocumentName}' is Verified!";
            }
            else if (statusUpper == "REJECTED")
            {
                subject = "Document Rejected - Action Required";
                htmlMessage = $"<h3>Hi {payload.UserName},</h3>" +
                              $"<p>Unfortunately, your document <b>'{payload.DocumentName}'</b> was rejected.</p>" +
                              $"<p><b>Reason:</b> {payload.Remarks}</p>" +
                              $"<p>Please upload a corrected version.</p>";
                smsMessage = $"Hi {payload.UserName}, your document '{payload.DocumentName}' was Rejected. Reason: {payload.Remarks}";
            }
            else
            {
                return BadRequest("Invalid status. Must be VERIFIED or REJECTED.");
            }

            // 3. Dispatch the Email and SMS concurrently
            var emailTask = _emailService.SendEmailAsync(payload.UserEmail, subject, htmlMessage);
            var smsTask = _smsService.SendSmsAsync(payload.UserPhone, smsMessage);
            
            // Wait for both to complete
            await Task.WhenAll(emailTask, smsTask);

            // 4. Log the notification into the MySQL Database
            var log = new NotificationLog
            {
                UserEmail = payload.UserEmail,
                UserPhone = payload.UserPhone,
                DocumentName = payload.DocumentName,
                Status = payload.Status,
                Remarks = payload.Remarks
            };

            _dbContext.NotificationLogs.Add(log);
            await _dbContext.SaveChangesAsync();

            // 5. Return a 200 OK Response back to Java
            return Ok(new { message = "Notification sent and logged successfully!" });
        }
    }
}
