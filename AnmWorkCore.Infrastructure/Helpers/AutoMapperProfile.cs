using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace AnmWorkCore.Infrastructure.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            // CreateMap<PeopleDetails, Population>();
            // CreateMap<AccountDetails, Account>().ForMember(a => a.Email, map => map.MapFrom(vm => vm.UserName));
            // CreateMap<AccountDetails, Account>().ForMember(a => a.Password, map => map.MapFrom(vm => vm.ConfirmPassword));
        }
    }
}
