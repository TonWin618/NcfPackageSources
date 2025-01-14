using Senparc.Ncf.Core.Enums;
using Senparc.Ncf.Repository;
using Senparc.Ncf.Service;
using Senparc.Xncf.SenMapic.Domain.SiteMap;
using System;
using System.Threading.Tasks;

namespace Senparc.Xncf.SenMapic.Domain.Services
{
    public class SenMapicTaskService : ServiceBase<SenMapicTask>
    {
        private readonly IServiceProvider _serviceProvider;

        public SenMapicTaskService(IRepositoryBase<SenMapicTask> repo, IServiceProvider serviceProvider)
            : base(repo, serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task<SenMapicTask> CreateTaskAsync(string name, string startUrl, 
            int maxThread, int maxBuildMinutes, int maxDeep, int maxPageCount)
        {
            var task = new SenMapicTask(name, startUrl, maxThread, 
                maxBuildMinutes, maxDeep, maxPageCount);
            await SaveObjectAsync(task);
            return task;
        }

        private async Task SaveTaskStateAsync(SenMapicTask task, Action<SenMapicTask> updateAction)
        {
            try
            {
                updateAction(task);
                await SaveObjectAsync(task);
            }
            catch (Exception ex)
            {
                task.Error(ex.Message);
                await SaveObjectAsync(task);
                throw;
            }
        }

        public async Task StartTaskAsync(SenMapicTask task)
        {
            await SaveTaskStateAsync(task, t => t.Start());

            // 创建爬虫引擎
            var engine = new SenMapicEngine(
                serviceProvider: _serviceProvider,
                urls: new[] { task.StartUrl },
                maxThread: task.MaxThread,
                maxBuildMinutesForSingleSite: task.MaxBuildMinutes,
                maxDeep: task.MaxDeep,
                maxPageCount: task.MaxPageCount
            );

            // 异步执行爬虫任务
            _ = Task.Run(async () =>
            {
                try
                {
                    var result = engine.Build();
                    await SaveTaskStateAsync(task, t =>
                    {
                        t.IncrementCrawledPages();
                        t.Complete();
                    });
                }
                catch (Exception ex)
                {
                    await SaveTaskStateAsync(task, t => t.Error(ex.Message));
                }
            });
        }
    }
} 