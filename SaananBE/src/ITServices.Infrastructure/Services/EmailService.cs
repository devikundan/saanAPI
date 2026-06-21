using System.Net;
using System.Net.Mail;
using ITServices.Application.DTOs.EmailNotifications;
using ITServices.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ITServices.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettingsDto _settings;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _logger = logger;
        _settings = new EmailSettingsDto();
        configuration.GetSection("EmailSettings").Bind(_settings);
    }

    public async Task<bool> SendEmailAsync(EmailRequestDto request)
    {
        try
        {
            using var client = new SmtpClient(_settings.SmtpHost, _settings.SmtpPort)
            {
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                EnableSsl = _settings.EnableSsl
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_settings.SenderEmail, _settings.SenderName),
                Subject = request.Subject,
                Body = request.Body,
                IsBodyHtml = request.IsHtml
            };
            mailMessage.To.Add(new MailAddress(request.ToEmail, request.ToName));

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation("Email sent to {Email}", request.ToEmail);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", request.ToEmail);
            return false;
        }
    }

    public async Task<bool> SendLeadNotificationAsync(string leadName, string leadEmail, string message)
    {
        var body = string.Format(
            "<h2>New Lead</h2><p><b>Name:</b> {0}</p><p><b>Email:</b> {1}</p><p><b>Message:</b></p><p>{2}</p>",
            leadName, leadEmail, message);
        var req = new EmailRequestDto { ToEmail = _settings.SenderEmail, ToName = "Admin", Subject = "New Lead: " + leadName, Body = body, IsHtml = true };
        return await SendEmailAsync(req);
    }

    public async Task<bool> SendContactMessageNotificationAsync(string senderName, string senderEmail, string subject, string message)
    {
        var body = string.Format(
            "<h2>Contact Message</h2><p><b>From:</b> {0} ({1})</p><p><b>Subject:</b> {2}</p><p><b>Message:</b></p><p>{3}</p>",
            senderName, senderEmail, subject, message);
        var req = new EmailRequestDto { ToEmail = _settings.SenderEmail, ToName = "Admin", Subject = "Contact: " + subject, Body = body, IsHtml = true };
        return await SendEmailAsync(req);
    }
}
