using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Console_RestAPI
{
    public class Users
    {
        public User[] users { get; set; }
    }

    public class User
    {
        public _Id _id { get; set; }
        public string username { get; set; }
        public string hash { get; set; }
        public string salt { get; set; }
        public string mail { get; set; }
        public Answered[] answered { get; set; }
    }

    public class _Id
    {
        public string oid { get; set; }
    }

    public class Answered
    {
        public string id { get; set; }
        public bool[] answers { get; set; }
    }
}
