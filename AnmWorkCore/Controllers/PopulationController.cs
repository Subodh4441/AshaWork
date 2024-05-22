using AnmWorkCore.Entity.Model;
using AnmWorkCore.Models;
using AnmWorkCore.Services.Interface;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnmWorkCore.Controllers
{
    //[ApiController]
    //[Route("[controller]")]
    public class PopulationController : Controller
    {
        private readonly IPopulationServices _populationServices;
        private readonly IMapper _mapper;
        public PopulationController(IPopulationServices populationServices, IMapper mapper)
        {
            this._populationServices = populationServices;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<PeopleDetails>>> GetPeoples()
        {
            var people = await this._populationServices.GetAllPeople();
            var records = _mapper.Map<List<PeopleDetails>>(people);
            return View(records);
        }

        public IActionResult AddPeople()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AddPeople(PeopleDetails peopleDetails)
        {
            if (ModelState.IsValid)
            {
                var population = _mapper.Map<Population>(peopleDetails);
                var result = await _populationServices.CreatePeople(population);
                if (result)
                {
                    return RedirectToAction("AddPeople", peopleDetails);
                }
                else
                {
                    ModelState.AddModelError("", "Failed to create people");
                }
            }
            return View("AddPeople", peopleDetails);
        }
    }
}
