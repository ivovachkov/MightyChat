
/* Sample usage - processing the request in ASP.NET */

using Dajbych.MultipartReader;
using System.Web;

public void ProcessRequest(HttpContext context) {
    var parts = context.Request.FormDataParts();
    byte[] part1 = parts["part_1_name"].Content;
    byte[] part2 = parts["part_2_name"].Content;
	string part3 = parts["part_3_name"].ToString();
    // ...
}




/* Sample usage - sending the request from Windows Runtime */

using System.Net.Http;

public async void SendRequest(HttpContent data1, HttpContent data2) {
    using (var client = new HttpClient()) {
        var content = new MultipartFormDataContent();
        content.Add(data1, "part_1_name");
        content.Add(data2, "part_2_name");
        using (var response = await client.PostAsync("http://www.contoso.com/", content)) {
            // ...
        }
    }
}