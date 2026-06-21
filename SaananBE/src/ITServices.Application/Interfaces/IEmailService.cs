using ITServices.Application.DTOs.EmailNotifications;

namespace ITServices.Application.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(EmailRequestDto request);
    Task<bool> SendLeadNotificationAsync(string leadName, string leadEmail, string message);
    Task<bool> SendContactMessageNotificationAsync(string senderName, string senderEmail, string subject, string message);
}
