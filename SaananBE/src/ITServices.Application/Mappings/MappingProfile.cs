using AutoMapper;
using ITServices.Application.DTOs.Blogs;
using ITServices.Application.DTOs.ContactMessages;
using ITServices.Application.DTOs.Content;
using ITServices.Application.DTOs.Faqs;
using ITServices.Application.DTOs.Leads;
using ITServices.Application.DTOs.Newsletter;
using ITServices.Application.DTOs.Portfolio;
using ITServices.Application.DTOs.ProposalSummary;
using ITServices.Application.DTOs.QueryClassification;
using ITServices.Application.DTOs.ServiceCategories;
using ITServices.Application.DTOs.Services;
using ITServices.Application.DTOs.Testimonials;
using ITServices.Domain.Entities;

namespace ITServices.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ServiceCategory mappings
        CreateMap<ServiceCategory, ServiceCategoryResponseDto>();
        CreateMap<ServiceCategory, ServiceCategoryWithServicesDto>();
        CreateMap<CreateServiceCategoryRequestDto, ServiceCategory>();
        CreateMap<UpdateServiceCategoryRequestDto, ServiceCategory>();

        // Service mappings
        CreateMap<Service, ServiceResponseDto>()
            .ForMember(dest => dest.ServiceCategoryName,
                opt => opt.MapFrom(src => src.ServiceCategory != null ? src.ServiceCategory.Name : string.Empty));
        CreateMap<Service, ServiceInCategoryDto>();
        CreateMap<CreateServiceRequestDto, Service>();
        CreateMap<UpdateServiceRequestDto, Service>();

        // Lead mappings
        CreateMap<Lead, LeadResponseDto>()
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.ServiceTitle,
                opt => opt.MapFrom(src => src.Service != null ? src.Service.Title : null));
        CreateMap<CreateLeadRequestDto, Lead>();

        // ContactMessage mappings
        CreateMap<ContactMessage, ContactMessageResponseDto>();
        CreateMap<CreateContactMessageRequestDto, ContactMessage>();

        // FAQ mappings
        CreateMap<Faq, FaqResponseDto>();
        CreateMap<CreateFaqRequestDto, Faq>();
        CreateMap<UpdateFaqRequestDto, Faq>();

        // Testimonial mappings
        CreateMap<Testimonial, TestimonialResponseDto>();
        CreateMap<CreateTestimonialRequestDto, Testimonial>();
        CreateMap<UpdateTestimonialRequestDto, Testimonial>();

        // Portfolio mappings
        CreateMap<PortfolioProject, PortfolioResponseDto>();
        CreateMap<CreatePortfolioRequestDto, PortfolioProject>();
        CreateMap<UpdatePortfolioRequestDto, PortfolioProject>();

        // Blog mappings
        CreateMap<Blog, BlogResponseDto>();
        CreateMap<Blog, BlogListResponseDto>();
        CreateMap<CreateBlogRequestDto, Blog>();
        CreateMap<UpdateBlogRequestDto, Blog>();

        // Content mappings
        CreateMap<Content, ContentResponseDto>();
        CreateMap<UpdateContentRequestDto, Content>();

        // Newsletter mappings
        CreateMap<NewsletterSubscriber, NewsletterSubscriberResponseDto>();
        CreateMap<NewsletterSubscribeRequestDto, NewsletterSubscriber>();

        // QueryClassification mappings
        CreateMap<QueryClassification, QueryClassificationResponseDto>();

        // ProposalSummary mappings
        CreateMap<ProposalSummary, ProposalSummaryResponseDto>();
    }
}
