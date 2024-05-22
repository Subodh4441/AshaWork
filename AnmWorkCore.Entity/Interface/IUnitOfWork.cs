using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Entity.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        IPeopleRepository people { get; }
        int Save();
    }
}
