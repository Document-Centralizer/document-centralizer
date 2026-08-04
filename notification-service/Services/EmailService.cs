using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;
using System.Threading.Tasks;

namespace notification_service.Services
{
    /*
     * Class Name: EmailService
     * Purpose: Implements the IEmailService interface using MailKit.
     * This class connects to an SMTP server and dispatches real emails.
     */
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        // Constructor Injection: We inject IConfiguration to read appsettings.json
        // and ILogger to log success or error messages to the console.
        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            // 1. Create a new Email message object
            var email = new MimeMessage();
            
            // Set the Sender (from appsettings.json) and Receiver
            email.From.Add(new MailboxAddress("Document Centralizer", _config["SmtpSettings:Username"]));
            email.To.Add(new MailboxAddress("User", toEmail));
            
            // Set the Subject and the HTML body of the email
            email.Subject = subject;
            var builder = new BodyBuilder { HtmlBody = htmlMessage };
            email.Body = builder.ToMessageBody();

            // 2. Connect to the SMTP server and send the email
            using var smtp = new SmtpClient();
            try
            {
                // Connect to the SMTP Host and Port
                var host = _config["SmtpSettings:Host"];
                var port = int.Parse(_config["SmtpSettings:Port"] ?? "587");
                
                // Secure connection option (StartTLS is highly recommended)
                await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);

                // Authenticate using the Username and Password
                var username = _config["SmtpSettings:Username"];
                var password = _config["SmtpSettings:Password"];
                await smtp.AuthenticateAsync(username, password);

                // Send the email and then cleanly disconnect
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);
                
                _logger.LogInformation($"Successfully sent email to {toEmail}");
            }
            catch (System.Exception ex)
            {
                _logger.LogError($"Failed to send email to {toEmail}. Error: {ex.Message}");
            }
        }
    }
}
