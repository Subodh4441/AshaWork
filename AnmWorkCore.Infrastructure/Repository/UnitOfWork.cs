using AnmWorkCore.Entity.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Infrastructure.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AnmDbContext _dbContext;
        public IPeopleRepository people { get; }
        public UnitOfWork(AnmDbContext dbContext, IPeopleRepository peopleRepository)
        {
            _dbContext = dbContext;
            people = peopleRepository;
        }

        public int Save()
        {
            return _dbContext.SaveChanges();
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _dbContext.Dispose();
            }
        }
    }
}
