using AnmWorkCore.Entity.Interface;
using AnmWorkCore.Infrastructure.Helpers;
using AnmWorkCore.Infrastructure.Repository;
using AnmWorkCore.Services;
using AnmWorkCore.Services.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Infrastructure.ServiceExtension
{
    public static class ServiceExtension
    {
        public static IServiceCollection AddDIServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AnmDbContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("AnmDbConnection"));
            });
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPeopleRepository, PeopleRepository>();
            services.AddScoped<IPopulationServices, PopulationService>();
            services.AddAutoMapper(typeof(AutoMapperProfile).Assembly);

            return services;
        }
    }
}
