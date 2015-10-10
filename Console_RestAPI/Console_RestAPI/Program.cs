using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using RestSharp;
using System.Configuration;
using System.Net;
using Newtonsoft.Json.Linq;

namespace Console_RestAPI
{
    class Program
    {
        private static string KEY_API = "apikey";

        static void Main(string[] args)
        {
            string apikey = "";

            try
            {
                apikey = ConfigurationManager.ConnectionStrings[KEY_API].ConnectionString;
            }
            catch
            {
                Console.WriteLine("False config file, get a key and check the -TEMPLATE config file");
                Environment.Exit(0);
            }
            if (apikey == "Put api key here")
            {
                Console.WriteLine("Fill in the correct API key.");
                Environment.Exit(0);
            }

            var client = new RestClient("https://api.mongolab.com/api/1");
            var request = new RestRequest("databases/{database}/collections/{collection}/?apiKey={apikey}&q={'username':'admin'}", Method.GET);
            request.AddParameter("apikey", apikey, ParameterType.UrlSegment);
            request.AddParameter("database", "MongoLab_Mat", ParameterType.UrlSegment);
            request.AddParameter("collection", "users", ParameterType.UrlSegment);
            var res = client.Execute(request);
            Users result = JsonConvert.DeserializeObject<Users>("{ 'users': " + res.Content + "}");
            Console.WriteLine(res.Content);
            Console.ReadLine();
        }
    }
}
