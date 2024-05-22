using AnmWorkCore.Entity.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Infrastructure.Repository
{
    public class AnmDbContext : DbContext
    {
        public AnmDbContext(DbContextOptions<AnmDbContext> options) : base(options)
        {

        }
        public DbSet<Population> populations { get; set; }
    }
}
