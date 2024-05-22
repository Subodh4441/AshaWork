using AnmWorkCore.Entity.Interface;
using AnmWorkCore.Entity.Model;
using AnmWorkCore.Services.Interface;

namespace AnmWorkCore.Services
{
    public class PopulationService : IPopulationServices
    {
        private readonly IUnitOfWork _unitOfWork;

        public PopulationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<bool> CreatePeople(Population population)
        {
            if (population != null)
            {
                await _unitOfWork.people.Add(population);

                var result = _unitOfWork.Save();

                if (result > 0)
                    return true;
                else
                    return false;
            }
            return false;
        }

        public async Task<bool> DeletePeople(int populationId)
        {
            if (populationId > 0)
            {
                var population = await _unitOfWork.people.GetById(populationId);
                if (population != null)
                {
                    _unitOfWork.people.Delete(population);
                    var result = _unitOfWork.Save();

                    if (result > 0)
                        return true;
                    else
                        return false;
                }
            }
            return false;
        }

        public async Task<IEnumerable<Population>> GetAllPeople()
        {
            var peoplesList = await _unitOfWork.people.GetAll();
            return peoplesList;
        }

        public async Task<Population> GetPeopleById(int populationId)
        {
            if (populationId > 0)
            {
                var peopleDetails = await _unitOfWork.people.GetById(populationId);
                if (peopleDetails != null)
                {
                    return peopleDetails;
                }
            }
            return null;
        }

        public async Task<bool> UpdatePeople(Population peopleDetails)
        {
            if (peopleDetails != null)
            {
                var people = await _unitOfWork.people.GetById(peopleDetails.PopulationId);
                if (people != null)
                {
                    people.FullName = peopleDetails.FullName;
                    people.Address1 = people.Address1;
                    people.Address2 = people.Address2;
                    people.LandMark = people.LandMark;
                    people.Pincode = people.Pincode;
                    people.AdharNumber = people.AdharNumber;
                    people.Mobile = people.Mobile;

                    _unitOfWork.people.Update(people);

                    var result = _unitOfWork.Save();

                    if (result > 0)
                        return true;
                    else
                        return false;
                }
            }
            return false;
        }
    }
}