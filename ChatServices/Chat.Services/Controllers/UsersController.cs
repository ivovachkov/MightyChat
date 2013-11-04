using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Chat.Repository;
using Chat.Models;
using System.Configuration;

namespace Chat.Services.Controllers
{
    public class UsersController : ApiController
    {
        private UsersRepository data;

        public UsersController()
        {
            this.data = new UsersRepository(
                ConfigurationManager.AppSettings["MongoConnectionString"], 
                ConfigurationManager.AppSettings["Database"]);
        }

        public IEnumerable<User> GetAllUsers()
        {
            return data.All();
        }

        [HttpPost]
        public HttpResponseMessage RegisterOrLoginUser(User user)
        {
            var userFromData = this.data.All()
                .Where(x => x.UserName == user.UserName)  
                .FirstOrDefault();

            if (userFromData != null)
            {
                if (userFromData.Password != user.Password)
                {
                    return this.Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Incorrect password!");
                }

                User resultUser = new User()
                {
                    Id = userFromData.Id,
                    UserName = userFromData.UserName,
                    IsOnline = userFromData.IsOnline,
                    UnreceivedMessages = new List<Message>(userFromData.UnreceivedMessages)
                };

                userFromData = this.data.UpdateStatus(userFromData, true);
                userFromData = this.data.DeleteMessages(userFromData);
                return this.Request.CreateResponse(HttpStatusCode.OK, resultUser);
            }

            this.data.Add(user);
            var updatedUser = this.data.UpdateStatus(user, true);
            var response = this.Request.CreateResponse(HttpStatusCode.Created, updatedUser);
            return response;
        }

        [HttpPut]
        public HttpResponseMessage LogoutUser(User user)
        {
            var entity = this.data.All().Where(x => x.Id == user.Id).First();
            var updatedUser = this.data.UpdateStatus(entity, false);
            var response = this.Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }
    }
}
