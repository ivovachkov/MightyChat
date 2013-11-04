using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.IdGenerators;

namespace Chat.Models
{
    public class User
    {
        public User()
        {
            this.ContactList = new HashSet<string>();
            this.UnreceivedMessages = new HashSet<Message>();
        }

        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public bool IsOnline { get; set; }
        public ICollection<string> ContactList { get; set; }
        public ICollection<Message> UnreceivedMessages { get; set; }
    }
}