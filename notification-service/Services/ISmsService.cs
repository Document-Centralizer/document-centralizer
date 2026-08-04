using System.Threading.Tasks;

namespace notification_service.Services
{
    /*
     * Interface Name: ISmsService
     * Purpose: Defines a contract for our SMS Service.
     * Any class that implements this must provide the SendSmsAsync method.
     */
    public interface ISmsService
    {
        // Method to send an SMS asynchronously.
        // It takes the recipient's phone number and the text message.
        Task SendSmsAsync(string phoneNumber, string message);
    }
}
