using AnmWorkCore.Entity.Interface;
using AnmWorkCore.Entity.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Infrastructure.Repository
{
    public class PeopleRepository : GenericRepository<Population>, IPeopleRepository
    {
        public PeopleRepository(AnmDbContext dbContext) : base(dbContext)
        {

        }
    }
}
