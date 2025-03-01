﻿using AutoMapper;
using Senparc.Ncf.Core.Models.DataBaseModel;
using Senparc.Ncf.Repository;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Senparc.Ncf.Service
{
    public class SysRoleService : ClientServiceBase<SysRole>
    {
        public SysRoleService(ClientRepositoryBase<SysRole> repo, IServiceProvider serviceProvider) : base(repo, serviceProvider)
        {

        }

        public async Task CreateOrUpdateAsync(SysRoleDto dto)
        {
            SysRole sysRole;
            if (String.IsNullOrEmpty(dto.Id))
            {
                sysRole = new SysRole(dto);
            }
            else
            {
                sysRole = await GetObjectAsync(_ => _.Id == dto.Id);
                sysRole.Update(dto);
            }
            await SaveObjectAsync(sysRole);
        }
    }
}
