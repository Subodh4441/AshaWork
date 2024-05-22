using AnmWorkCore.Entity.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnmWorkCore.Services.Interface
{
    public interface IPopulationServices
    {
        Task<bool> CreatePeople(Population population);

        Task<IEnumerable<Population>> GetAllPeople();

        Task<Population> GetPeopleById(int productId);

        Task<bool> UpdatePeople(Population population);

        Task<bool> DeletePeople(int populationId);
    }
}
