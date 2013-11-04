using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Chat.Repository
{
    public interface IRepository<T>
    {
        void Add(T entity);
        IQueryable<T> All();
        T UpdateStatus(T entity, bool status);
    }
}
