#NodeJS REST / MONGO

NodeJS project by Brecht Carlier and Matthew Berkvens.

This is the NodeJS server for the Codegenie project made by Brecht, Arne and Matthew.
This project also contains our views. These are written in JADE.

##At the moment
Backend:
We're able to get, post and edit the Users, Exercises and Answers in json format from the online database.
Now we're working on the authentication of users.

This solution uses the Mongoose library to talk to the online Database.

Frontend:
We use the bootstrap framework.
By using AJAX, We're able to put the data in the frontend (view). Used Tiles for buttons.
Used ACE editor to post answers.

There is also a login page.

Printscreen

![Printscreen questions](http://erazerbrecht.duckdns.org/Images/NodeJS_REST_MONGO_TEST2.png)
![Printscreen](http://i.imgur.com/MTyw8FD.png)

##Bulding and using this project
Like every NodeJS project we supply a packages.json file the install the correct dependencies you need. (npm install)
If Moongose doesn't work on your computer take a look at: https://github.com/AP-Elektronica-ICT/project-cloud-applications-codegenie_arnematthewbrecht/issues/2
To connect to our database you will need the connectioninfo.config file (don't hesitate to ask it).

We used Visual Studio for this project, we recommend Node.js tools for Visual Studio.

##Mongoose Schema layout
For a post/edit to be accepted, the information must pass the validation, the following section will explain what is validated and how to pass it.


**All dates have the format of DD/MM/YYYY (e.g. 20/02/2015)**

**All emails must pass email-validation.**


*Defaults do not need need to be filled in, if the field is missing the server will default these.*

*All of these objects also have an internal _id field which can be used but I won't mention them again.*


###Users
Users have 9 fields, 4 of which are required and 4 which have a default.

Required: 
* name: string, name of the user (e.g. John Smith) **Is unique field**
* class: string, current class enrollment of the user (e.g. 3ea1)
* password: string, encrypted password (encrypted with bCrypt)

Defaults: 
* status: number, register status, defaults to 0.
* registerdate: date, when the user was posted, defaults to current time on the server.
* lastseen: date, currently automatically set to the current time on the server.
* admin: boolean, currently automatically set to false whatever is posted.

Not required but field is available: 
* email: string, for when the user wants to subscribe. **Is unique field*


###Exercises
Exercises have 7 fields, 3 of which are required and 2 which have a default.

Required:
* title: string, title of the exercise (e.g. MongoDB)
* classification: string, classification of the exercise (e.g. Databases)
* weight: number, maximum score and weight of this exercise (e.g. 20)

Defaults:
* created: date, when the exercise was posted, defaults to current time on the server
* extra: boolean, check if this exercise is an extra assignment or not, defaults to false

Not required but field is available: 
* deadline: date, date by which the exercise has to be solved
* questions: array of 'question' objects (see: [question object](#questionobject)), this is an array of the questions in this exercise.


###Answers
Answers have 4 fields, 2 of which are required and 1 which have a default.

Required:
* exerciseid: string, id of the exercise (e.g. 5637951a8a48cc983189c500)
* userid: string, id of the user (e.g. 5637951a8a48cc983189c500)

Defaults:
* registerdate: date, when the answer was posted, defaults to current time on the server.

Not required but field is available: 
* questions: array of 'answer' objects (see: [answer object](#answerobject)), this is an array of the question answers in this answer.


####Question object<a name="answerobject"></a>
The question object exists out of 4 fields, 3 of which are required and 1 which has a default.

Required:
* question: string, question of this question (e.g. What is 'MongoDB'?)
* weight: number, maximum score and weight of this exercise (e.g. 20)
* type: string with enum, type of question (currently accepted: 'Checkbox', 'Question', 'Code')

Defaults:
* extra: boolean, check if this question is an extra question or not, defaults to false.

####Answer object<a name="answerobject"></a>
The answer object exists out of 5 fields, 3 of which are required and 2 which have a default.

Required:
* answered: boolean, check to see if this question answer was included in answer post.
* received: number, received score of this question answer (e.g. 5)
* type: string with enum, type of question (currently accepted: 'Checkbox', 'Question', 'Code')

Defaults:
* comment: string, if code/question was asked, this is the field it will be placed in, defaults to ''.
* extra: boolean, check if this question is an extra question or not, defaults to false.




##TODO:

- Come up with a better way to store '[question answers](#answerobject)' (currently doesn't need 'extra', could use a reference to the original '[question object](#questionobject)')
- Signup jade

