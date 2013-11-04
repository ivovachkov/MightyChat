using System;
using System.Collections.Generic;
using System.Linq;
using Chat.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Builders;
using MongoDB.Driver.Linq;
using Newtonsoft.Json;

namespace Chat.Repository
{
    public class UsersRepository : IRepository<User>
    {
        private MongoCollection users;

        public UsersRepository(string connectionString, string database)
        {
            var client = new MongoClient(connectionString);
            var server = client.GetServer();
            var db = server.GetDatabase(database);
            this.users = db.GetCollection<User>("users");
        }

        public void Add(User user)
        {
            this.users.Insert(user);
        }

        public IQueryable<User> All()
        {
            return this.users.AsQueryable<User>();
        }


        public User UpdateStatus(User entity, bool status)
        {
            entity.IsOnline = status;
            var query = Query.EQ("UserName", entity.UserName);
            var update = new UpdateDocument { { "$set", new BsonDocument("IsOnline", entity.IsOnline.ToString()) } };
            this.users.Update(query, update);
            return entity;
        }

        public void UpdateMessages(User entity)
        {
            this.users.Save(entity, SafeMode.True);
        }

        public User DeleteMessages(User entity)
        {
            entity.UnreceivedMessages.Clear();
            var result = this.users.Save(entity, SafeMode.True);
            return entity;
        }
    }
}
