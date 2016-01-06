#NodeJS REST / MONGO

This is our code for the Codegenie project made by Brecht, Arne and Matthew. It contains every thing, backend and frontend!

##At the moment
#####Backend:
We're able to get, post and edit the Users, Exercises and Answers in json format from the online database.
The authentication of users is also working. We're working to generate some statistics calculated from the data in the database.

Nevertheless this part is as good as done. Al the needed basic functionality works, and now we're just adding extra features.

#####Frontend:
There are currently 4 pages: a login page, signup page, adminpanel and a userpanel.

* Login and signup pages: Self-explanatory
* Adminpanel: The "home" page for the admin (Tim Dams)
  * Has the following views:  
    * Dashboard with some statistics 
      * Total answers, Unrevised answers
      * Answers of all courses seperatly
      * Amount of total answers per week
      * The lastest answers splitted by course
    * Excercises
      * Adding new exercises
      * Filter existing exercises
      * Editing existing exercises
      * Removing exercises with drag and drop
    * Users
      * Manage the users => Change their course!
      * Delete users
      * Check some information of the user (e-mail, lastseen)
    * Able to get a list of answers
      * ARNE 
* Userpanel: The page for the students
  * Has the following views: 
    * Dashboard: Home page
      * Shows some trivial inforamtion about yourself.
        * Amount of new exercises
        * Amount of total exercises solved
        * Is your activity lower of higher than average?
        * Graph of total answers per week
        * Punch card, shows acitity per day
    * Staticstics
      * Shows statistics not specific to user
        * Total answers (every user)
        * Total answers of the users in the same course
        * Your total amount of answers
        * Show graph of total answers by week (every user)
        * Show top 5 within the same course (best average)
        * Show top 5 with most exercises within the same course
    * Exercises
      * Can filter the exercises 
      * Will be used to post answers.
      * Also to view the solution and grades
    * Profile
      * Change your settings (email / password) 

What are we doing now?
Finishing the project...

##Dependencies

Current modules used (NodeJS => Backend): 
* nodemon: needs to be installed globally to work, if you want to use the regular node.exe delete the 'Node.exe path' string in the project properties.
* bcrypt: salts and hashes the password, also has a built-in check function.
* body-parser: parsing json posted information.
* connect-flash: for sending messages to the client.
* connect-mongo: user session storage.
* express: REST API-fication of NodeJS.
* express-session: for user sessions.
* jade: view engine.
* moment: date formatting.
* passport: user login/signup/authorization and sessions.
* passport-local: we are using the local method, aka storing it in a database yourself
* serve-favicon: this serves the favourite icon.


Frontend:
* Bootstrap: easy for making nice and responsive views
* AngularJS: used for client side routing and MVC pattern
* ACE editor: A code editor, we will use this to post code. It will mostly be used for syntaxhighlighting
* Beautify: Will format the code in the code editor
* momentJS and momentJS angular for dynamic relative time!
* Angular: ngDraggable: used to drop and drag our tiles to remove them
* ngResource: TODO Arne explain this short!

##Printscreens

TODO: Update this printsreens!!!

![Printscreen questions](http://erazerbrecht.duckdns.org/Images/NodeJS_REST_MONGO_TEST2.png)
![Printscreen](http://i.imgur.com/MTyw8FD.png)

##Bulding and using this project
We used Visual Studio for this project, we recommend [Node.js tools for Visual Studio](https://www.visualstudio.com/en-us/features/node-js-vs.aspx).

Like every NodeJS project we supply a packages.json file the install the correct dependencies you need. (npm install)
If Mongoose doesn't work on your computer take a look at: https://github.com/AP-Elektronica-ICT/project-cloud-applications-codegenie_arnematthewbrecht/issues/2

To connect to our database you will need a connectionstring (don't hesitate to ask it). U need to put this in a environment variable. We used the db (process.env.db) variable. U need to set this on your server machine. This can easily be done by defining it in the cmd windows where you will start your node server. In our project we use a startup script (startnodemon.cmd), there you will need to add the connectionstring!

If you use Visual Studio and Node.JS tools you can also change the env variabeles in the properties of the project!

##Mongoose Schema layout
For a post/edit to be accepted, the information must pass the validation, the following section will explain what is validated and how to pass it.


**All dates have the format of DD/MM/YYYY HH:MM:SS (e.g. 20/02/2015 15:20:30)**


*Defaults do not need need to be filled in, if the field is missing the server will default these.*

*All of these objects also have an internal _id field which can be used but I won't mention them again.*


###Users
Users have 9 fields, 4 of which are required and 4 which have a default.

Required: 
* name: string, name of the user (e.g. John Smith) *is unique field*
* password: string, encrypted password (encrypted with bCrypt)
* class: string, current class enrollment of the user (e.g. 1EA1)
* course: Current course *not implemented yet*

Defaults: 
* status: number, register status, defaults to 0.
* registerdate: date, when the user was posted, defaults to current time on the server.
* lastseen: date, currently automatically set to the current time on the server.
* admin: boolean, currently automatically set to false whatever is posted.

Not required but field is available: 
* email: string, for when the user wants to subscribe. *is unique & sparse field*


###Exercises
Exercises have 8 fields, 4 of which are required and 2 which have a default.

Required:
* title: string, title of the exercise (e.g. MongoDB)
* classification: string, classification of the exercise (e.g. Databinding)
* class: string, this is the class that is eligible to solve this exercise (e.g. 1EA1)
* course: Current course *not implemented yet*

Defaults:
* created: date, when the exercise was posted, defaults to current time on the server.
* extra: boolean, check if this exercise is an extra assignment or not, defaults to false.

Not required but field is available: 
* deadline: date, date by which the exercise has to be solved.
* questions: array of 'question' objects (see: [question object](#questionobject)), this is an array of the questions in this exercise.


###Answers
Answers have 10 fields, 8 of which are required and 1 which has a default.

Required:
* exerciseid: string, id of the exercise (e.g. 5637951a8a48cc983189c500)
* userid: string, id of the user (e.g. 5637951a8a48cc983189c500)
* title: string, title of the original exercise (e.g. Databinding)
* classification: string, classification of the original exercise (e.g. Databinding)
* class: string, this is the class that is eligible to solve this exercise (e.g. 1EA1)
* revised: boolean, check if the answer has been revised by the teacher.
* extra: boolean, check if the original exercise is an extra assignment or not.
* course: Current course *not implemented yet*

Defaults:
* created: date, when the answer was posted, defaults to current time on the server.

Not required but field is available: 
* answers: array of 'answer' objects (see: [answer object](#answerobject)), this is an array of the question answers in this answer.



####Question object<a name="questionobject"></a>
The question object exists out of 5 fields, 2 of which are required and 2 which have a default.

Required:
* question: string, title of this question (e.g. What is 'Databinding'?)
* weight: number, maximum score and weight of this exercise (e.g. 20)

Defaults:
* extra: boolean, check if this question is an extra question or not, defaults to false.
* type: string with enum, type of question (currently accepted: 'Checkbox', 'Question', 'Code')(defaults to "Checkbox")

Not required but field is available:
* choices: array of objects with field 'text' and 'correct', multiple choice questions are saved here, correct indicates if it is the correct choice or not.

####Answer object<a name="answerobject"></a>
The answer object exists out of 9 fields, 5 of which are required and 1 which has a default.

Required:
* questionid: number, reference to the original questionid (e.g. 5637951a8a48cc983189c500)
* questiontitle: string, title of the original question (e.g. What is 'Databinding'?)
* weight: number, maximum score and weight of the original question (e.g. 5)
* extra: boolean, check if the original question is an extra question or not.
* type: string with enum, type of original question (currently accepted: 'Checkbox', 'Question', 'Code', 'MultipleChoice')

Defaults:
* received: number, how much the user received for this exercise (e.g. 5) (defaults to 0 obviously)

Not required but field is available: 
* result: string, if code/question was asked, this is the field it will be placed in.
* feedback: number, the user's feedback to this question.
* choices: array of objects with field 'text', multiple choice answers are saved here.



##Data access, Information Portals

There are currently 3 portals, the /admin/ portal, /users/ portal and the /statistics/ portal.



###User portal
The user portal has 8 gets and 2 posts.


**GET**: /users/

This gives all current users, currently only accessible for admin.

**GET**: /users/mine

This gives the current user's information.


**GET**: /users/exercises

This gives all current exercises that the user is allowed to solve.

**GET**: /users/exercises/new

This gives all the exercises that haven't been viewed by the user.

**GET**: /users/exercises/solved

This gives all the current exercises that the user has solved.

**GET**: /users/exercises/unsolved

This gives all the current exercises that the user has yet to solve.

**GET**: /users/exercises/{ID} 

This gives a specific exercise that the user is allowed to solve.

**GET**: /users/exercises/{ID}/answers

This gives the answer corresponding with the exercise ID.


**GET**: /users/seen/

This gives the list of exercises that have been seen by the user.

**POST**: /users/seen/{ID}

This is for posting when the user has opened a new exercise.


**GET**: /users/answers

This gives all the answers that the user has submitted.<br/>
?display=summary can be added to this statement to get a summary instead of the whole thing.

**GET**: /users/answers/{ID} 

This gives a specific answer that the user has submitted.

**POST**: /users/answer

Users can post/edit solved exercises here.

**Only information needed:**<br/>
Original exercise ID in a field named 'exerciseid'<br/>
Array of [answer objects](#answerobject) with the field 'questionid' and 'text' filled in<br/>


**POST**: /users/edit

Users can edit their profiles here.




###Admin portal
The admin portal has 12 gets and 4 posts.


**GET**: /admin/

HTML page for the admin panel.


**POST**: /admin/users

Admins can create new users by posting here.

**POST**: /admin/users/assign

The admin can assign users by posting here.

**GET**: /admin/users/{ID}

Gives the userdata of userid {ID}

**GET**: /admin/users/{ID}/delete

Deletes the user with this ID.

**GET**: /admin/users/{ID}/answers

Gives all answers of userid {ID}<br/>
?display=summary can be added to this statement to get a summary instead of the whole thing.


**GET**: /admin/exercises

This gives all the exercises.

**GET**: /admin/exercises/{ID}

This gives a specific exercise.

**GET**: /admin/exercises/{ID}/answers

This gives all the answers of the exercise with ID: {ID}

**GET**: /admin/exercises/delete/{ID}

This deletes the exercise with ID: {ID}

**POST**: /admin/exercises/post

The admin can create exercises by posting here.

**POST**: /admin/exercises/edit/{ID}

The admin can edit exercises by posting here.


**GET**: /admin/answers 

This gives all answers.

**GET**: /admin/answers/revised

This gives all unrevised answers.

**GET**: /admin/answers/unrevised

This gives all revised answers.

**GET**: /admin/answers/{ID}

This gives a specific answer.

**GET**: /admin/answers/delete/{ID}

This deletes the answer with ID: {ID}

**POST**: /admin/answers/edit/{ID}

The admin can edit answers by posting here.



###Statistics portal
The statistics has 8 gets.

**GET**: /statistics/

Gives various numbers on the amount of users, admins, exercises, answers and users per class.

**GET**: /statistics/graph

Gives the week information about all answers.<br/>
?filter=year or ?filter=week to filter the exercises by year or week.

**GET**: /statistics/users/{ID}

Gives summary about all this users answers.

**GET**: /statistics/exercises

Gives the amount of exercises and amount of exercises per class.

**GET**: /statistics/exercises/graph/{ID}

Gives summaries about when users solved this exercise that can be used in a fancy graph.<br/>
?filter=year or ?filter=week to filter the exercises by year or week.

**GET**: /statistics/exercises/average/{ID}

Gives summary about the average score from this exercise that can be used in a fancy graph. (excludes unrevised answers)

**GET**: /statistics/answers

Gives the amount of answers and the amount of answers solved per class.

**GET**: /statistics/answers/revised

Gives the amount of answers that have been revised and amount of revised answers per class.

**GET**: /statistics/answers/unrevised

Gives the amount of answers that have not been revised yet and amount of unrevised answers per class.



##TODO:

- Finish user panel
- Fix lastseen update
- Make fancy graphs
- Finish profile manager
