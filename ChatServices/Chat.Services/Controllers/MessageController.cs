using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Newtonsoft.Json;
using Chat.Models;
using Chat.Repository;
using System.Configuration;

namespace Chat.Services.Controllers
{
    public class MessageController : ApiController
    {
        private UsersRepository data;

        public MessageController()
        {
            this.data = new UsersRepository(
               ConfigurationManager.AppSettings["MongoConnectionString"],
               ConfigurationManager.AppSettings["Database"]);
        }        

        [HttpPost]
        public HttpResponseMessage PostMessage([FromBody]Message message)
        {
            var receiverId = message.ReceiverId;
            var currUser = this.data.All().Where(x => x.Id == receiverId).First();

            currUser.UnreceivedMessages.Add(message);
            this.data.UpdateMessages(currUser);

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        public ICollection<Message> GetMessages(string id)
        {
            var currUser = this.data.All().Where(x => x.Id == id).First();

            return currUser.UnreceivedMessages;
        }
    }
}
