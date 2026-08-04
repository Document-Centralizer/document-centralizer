using System.Threading.Tasks;

namespace notification_service.Services
{
    /*
     * Interface Name: IEmailService
     * Purpose: Defines a contract for our Email Service.
     * Any class that implements this interface MUST provide the SendEmailAsync method.
     */
    public interface IEmailService
    {
        // Method to send an email asynchronously.
        // It takes the recipient's email, the subject, and the HTML body of the email.
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);
    }
}
