using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
namespace Chat.Models
{
    public class Message
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string Id { get; set; }
        public string Content { get; set; }
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string FileName { get; set; }
        public string FileUrl { get; set; }
    }
}
