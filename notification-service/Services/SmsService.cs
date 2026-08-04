using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace notification_service.Services
{
    /*
     * Class Name: SmsService (Stub)
     * Purpose: Implements the ISmsService interface.
     * Currently acts as a "Stub" (mock) that logs the SMS to the console.
     * In the future, we can inject Twilio API logic here without changing controllers.
     */
    public class SmsService : ISmsService
    {
        private readonly ILogger<SmsService> _logger;

        // Constructor Injection for logging
        public SmsService(ILogger<SmsService> logger)
        {
            _logger = logger;
        }

        public Task SendSmsAsync(string phoneNumber, string message)
        {
            // Simulate sending an SMS by printing a warning to the console
            // Using Task.CompletedTask because we aren't awaiting any real network call yet
            _logger.LogWarning($"[MOCK SMS] Sent to {phoneNumber}: {message}");
            
            return Task.CompletedTask;
        }
    }
}
