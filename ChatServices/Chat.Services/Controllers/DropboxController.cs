﻿using Chat.Models;
using Chat.Repository;
using Spring.IO;
using Spring.Social.Dropbox.Api;
using Spring.Social.Dropbox.Connect;
using System.Collections.Generic;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Chat.Services.Controllers
{
    public class DropboxController : ApiController
    {
        private Dropbox appAuth = new Dropbox { Value = "5hq4n8kjyopqzje", Secret = "22h4xl0x1g569af" };
        private Dropbox userAuth = new Dropbox { Value = "higmkxi48pfhv8jt", Secret = "0wouwudro53wmkz" };
        private IRepository<Dropbox> data;

        public DropboxController()
        {
            this.data = new DropBoxRepository(
               ConfigurationManager.AppSettings["MongoConnectionString"],
               ConfigurationManager.AppSettings["Database"]);
        }

        private string DropboxShareFile(string path, string filename)
        {
            DropboxServiceProvider dropboxServiceProvider =
                new DropboxServiceProvider(this.appAuth.Value, this.appAuth.Secret, AccessLevel.AppFolder);
            IDropbox dropbox = dropboxServiceProvider.GetApi(this.userAuth.Value, this.userAuth.Secret);

            Entry uploadFileEntry = dropbox.UploadFileAsync(
                new FileResource(path), filename).Result;

            var sharedUrl = dropbox.GetMediaLinkAsync(uploadFileEntry.Path).Result;
            return (sharedUrl.Url + "?dl=1"); // we can download the file directly
        }

        [HttpPost]
        public HttpResponseMessage Post()
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            if (httpRequest.Files.Count > 0)
            {
                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var filePath = HttpContext.Current.Server.MapPath("~/App_Data/" + postedFile.FileName);
                    postedFile.SaveAs(filePath);

                    docfiles.Add(DropboxShareFile(filePath, postedFile.FileName));
                }
                result = Request.CreateResponse(HttpStatusCode.Created, docfiles);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }
 
    }
}