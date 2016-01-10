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
      * See all answers that need revising
      * Filtering through answers (extra, expired, class)
      * Revising answer for each user that answered the exercise
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

Adminpanel has a javascript file at /public/javascripts/adminpanel.js that takes care of the intitalization of the AngularJS module. Also, in this file the routing of views takes place! Every view that is loaded in at the adminpanel has its own controller. The adminpanel himself also has a controller. All controllers are placed in /public/javascripts/controllers! The names of the controllers are self-explanatory.

The same structure is used on the userpanel!

Our 4 main views (seperate html pages), they can be found at /views/. They are loaded by our NodeJS code. They are build in JADE, this has as advantage that we can bind on server side variables! The views we load in our main views (loaded with AngularJS) are written in html and can be found at /public/views/

##What are we doing now?
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
* ngResource: A default angularjs factory which creates a resource object that lets you interact with RESTful server-side data sources
* Messagebox: Fancy alert box with animation to show errors and messages from backend to frontend (TODO: Check Matthew)
* Elastic: A third party module that can be added to our own angular module. It gives us the ability to resize textarea depending on how much text or enters you put into it.ar
* Punchcard: Shows activity of user in nice punch-card (same as GitHub)
* nvd3: makes fancy graphs, based on d3. Will be used to show some statistics
* Bootstrap checkbox: nicer checkboxes with more options than default ones

##Printscreens

TODO: Update this printsreens!!!

![Printscreen questions](http://erazerbrecht.duckdns.org/Images/NodeJS_REST_MONGO_TEST2.png)
![Printscreen](http://i.imgur.com/MTyw8FD.png)

##Bulding and using this project
First we used Visual Studio for this project. If you use Visual Studio we recommend [Node.js tools for Visual Studio](https://www.visualstudio.com/en-us/features/node-js-vs.aspx). This tool also makes it easier to publish on Azure...

Like every NodeJS project we supply a packages.json file the install the correct dependencies you need. (npm install)
If Mongoose doesn't work on your computer take a look at: https://github.com/AP-Elektronica-ICT/project-cloud-applications-codegenie_arnematthewbrecht/issues/2

To connect to our database you will need a connectionstring (don't hesitate to ask it). U need to put this in a environment variable. We used the db (process.env.db) variable. U need to set this on your server machine (e.g. Heroku, Azure, Local, ...). This can easily be done by defining it in the cmd windows where you will start your node server. In our project we used a startup script (startnodemon.cmd) that will do it for you! The only thing you need to do is make a file connectioninfo.config in the folder mongoose. It's important to use UTF-8 (Without BOM) as enconding for the file!

If you use Visual Studio and Node.JS tools you can also change the env variabeles in the properties of the project! We recommend to do this. This is a better way of starting a node project, you start the project by pressing the green run button of Visual Studio (like you used to do with C# applications).

Later on we decided to change to WebStorm as our main IDE. This IDE has better support for Javascript. Because of that also better support for AngularJS and NodeJS. We now have better syntaxhighlighting and better code completion! The license for WebStorm is the same as the one for Resharper. Students just need to verify their academic status and you are good to roll. In WebStorm it's also quite easy to setup the environment variabeles. There is no need anymore for the start up script. In fact the project will run in WebStorm you will not see a CMD console. This has a nice advantage, you can easily navigate to the correct line for solving node bug and errors!

##Flow of the application
The first route you connect to is our root route. We called this route index.js. This route will determine if your're already signed in. If you are, you're automatically redirected to the home.js route.

If not the login.jade will be rendered in your browser. This view is a sigin form. There is also the possibility to make a new account. If you want this, you will be routed the the signup.js route. The sigup.jade view will be rendered. You can now post userdetails to this route for making a new account. The request will be processed by our passport module.

This module takes care of our login / signup logic. Three main tasks, making a new user with a hashed (bcrypt) password, if the user credentials are corrent and check if the visitor is signed in / check if the visitor is an admin. The logic for this module can be found in the folder *passport*

If you already have an account, you can of course login. You'll post your credentials to /login. It will check with our passport module if the credentails are correct. This logic can be found @ */pasport/login.js*. If it's not correct you will see a 'flash-message' (nothing to do with Adobe Flash).

If everything was correct you will be routed to /home. This route (home.js) will render the correct panel. If you're an admin it will render the adminpanel if you're not it will render the userpanel. It also uses a *authlevel*,  these a clearance levels we defined. If you do not meet this clearance level there happens something (show error, redirect). You can find these in the passport/authlevels.js file. For the /home route we used *'isLoggedInRedirect'* like the name says if you're not logged in, you will be redirected to the index page (you'll see login.jade). This is to prevent that users try to login with manually changing the URL.

When you login as an admin, adminPanel.jade and adminPanel.js will be loaded. In the jade file will be the shell of our application. The navigation will be there and also the title bar with some information on it. The adminPanel.js contains all the routes to the different views. A route is a way that angular knows which controller and view needs to be loaded. By default the route is "/". This will load the adminDashboard.html view together with the adminDashBoardController.js controller. The controller describes how the react when you interact with your view (pressing buttons, clicking stuff). 
Now let's press "users" in the navigation. This will go to the url: /users. The adminPanel.js sees this route and will load the adminUsers.html and the adminUsersController accordingly. 
![adminUsers](http://i.imgur.com/e33OUWu.png)
The admin sees all the users that have an account on the application including in which course this user is located. The admin can see some general information about the user. Email, last time logged in and how active the user is. The admin can delete users, move them around through different courses. Last but not least there is a filter option on the course. So the admin can easily change a group of courses to a new course. 

Let's press answers in the navigation. This will go to the url: /answers. The andminPanel.js sees this route and will load the adminAnswers.html and the adminAnswersController accordingly
![adminAnswers](http://i.imgur.com/RyVYcnX.png)
This is the view where the admin can see all the exercises that need to be revised. There is also a filter which can be turned on and off. By default the filter is on and will only show the expired answers (deadline is over so admin can start correcting). 
![adminAnswersNoFilter](http://i.imgur.com/GVMcbQx.png)
When the filter is off you see all the answers. Red tiles mean that the deadline is over and those can be corrected. Blue means deadline isn't over yet so answers can still be added. The admin can now chose to revise an answer. It will show all the users who answered the question.
![adminAnswersCorrecting](http://i.imgur.com/cofblJR.png)
when opening a user it shows the answer the user gave to the questions. The admin can give the user all the points because everything is correct. Or give every question points separately. When the admin gave points to every user it can press submit and the points and comment will be saved.




## Mongoose Schema layout
For a post/edit to be accepted, the information must pass the validation, the following section will explain what is validated and how to pass it.


**All dates have the UTC format**


*Defaults do not need need to be filled in, if the field is missing the server will default these.*

*All of these objects also have an internal _id field which can be used but won't be mentioned again.*


###Users
Required: 
* name: string, name of the user (e.g. John Smith) *is unique field*
* password: string, encrypted password (encrypted with bCrypt)
* class: string, current class enrollment of the user (e.g. 1EA1)
* course: string, course the user is in. (e.g. Programming Principles)

Defaults: 
* status: number, register status, defaults to 0.
* registerdate: date, when the user was posted, defaults to current time on the server.
* lastseen: date, currently automatically set to the current time on the server.
* admin: boolean, currently automatically set to false whatever is posted.

Not required but field is available: 
* email: string, for when the user wants to subscribe. *is unique & sparse field*
* logins: number, amount of times the user logged in. Increases once per login.


###Exercises
Required:
* title: string, title of the exercise (e.g. MongoDB)
* classification: string, classification of the exercise (e.g. Databinding)
* course: string, course the exercise is in. (e.g. Programming Principles)

Defaults:
* created: date, when the exercise was posted, defaults to current time on the server.
* extra: boolean, check if this exercise is an extra assignment or not, defaults to false.

Not required but field is available: 
* deadline: date, date by which the exercise has to be solved.
* revealdate: date, date when the exercise has to be revealed to the users.
* questions: array of 'question' objects (see: [question object](#questionobject)), this is an array of the questions in this exercise.


###Answers
Required:
* exerciseid: ID, id of the exercise (e.g. 5637951a8a48cc983189c500)
* userid: ID, id of the user (e.g. 5637951a8a48cc983189c500)
* title: string, title of the original exercise (e.g. Databinding)
* classification: string, classification of the original exercise (e.g. Databinding)
* course: string, course from the original exercise. (e.g. Programming Principles)
* extra: boolean, check if the original exercise is an extra assignment or not.

Defaults:
* created: date, when the answer was posted, defaults to current time on the server.
* revised: boolean, check if the answer has been revised by the teacher, defaults to false.

Not required but field is available: 
* answers: array of 'answer' objects (see: [answer object](#answerobject)), this is an array of the question answers in this answer.


###Seen
Required:
* userid: ID, id of the user (e.g. 5637951a8a48cc983189c500)

Not required but field is available: 
* seenexercises: array of 'seenexercise' objects (see: [seenexercise object](#seenexercise)), this is an array of exercises the user has seen/opened.



####Question object<a name="questionobject"></a>
Required:
* question: string, title of this question (e.g. What is 'Databinding'?)
* weight: number, maximum score and weight of this exercise (e.g. 20)

Defaults:
* extra: boolean, check if this question is an extra question or not. (defaults to false)
* type: string with enum, type of question (currently accepted: 'Checkbox', 'Question', 'Code', 'MultipleChoice') (defaults to "Checkbox")

Not required but field is available:
* choices: array of objects with field 'text' and 'correct', multiple choice questions are saved here, correct indicates if it is the correct choice or not.

####Answer object<a name="answerobject"></a>
Required:
* questionid: ID, reference to the original questionid (e.g. 5637951a8a48cc983189c500)
* questiontitle: string, title of the original question (e.g. What is 'Databinding'?)
* weight: number, maximum score and weight of the original question (e.g. 5)
* extra: boolean, check if the original question is an extra question or not.
* type: string with enum, type of original question (currently accepted: 'Checkbox', 'Question', 'Code', 'MultipleChoice')

Defaults:
* received: number, how much the user received for this exercise (e.g. 5) (defaults to 0)

Not required but field is available: 
* result: string, if code/question was asked, this is the field it will be placed in.
* comment: string, the admin's comment on this question.
* feedback: number, the user's feedback to this question.
* choices: array of objects with field 'text', multiple choice answers are saved here.

####Seenexercise object<a name="seenexercise"></a>
Required:
* exerciseid: ID, reference to the exercise ID (e.g. 5637951a8a48cc983189c500)

Defaults:
* dateseen: date, date the user has seen this exercise. (defaults to servertime)


##Data access, Information Portals

There are currently 3 portals, the /admin/ portal, /users/ portal and the /statistics/ portal.



###User portal

####Users

**GET**: /users/mine

This gives the current user's information.

**POST**: /users/edit

For editing the user's profile.

####Exercises

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

####Answers

**GET**: /users/answers

This gives all the answers that the user has submitted.<br/>
?display=summary can be added to this statement to get a summary instead of the whole thing.

**GET**: /users/answers/{ID} 

This gives a specific answer that the user has submitted.

**POST**: /users/answers

Users can post/edit solved exercises here.

**Only information needed:**<br/>
Original exercise ID in a field named 'exerciseid'<br/>
Array of [answer objects](#answerobject) with the field 'questionid' and 'text' filled in<br/>

####Seen

**GET**: /users/seen/

This gives the list of exercises that have been seen by the user.

**POST**: /users/seen/{ID}

This is for posting when the user has opened a new exercise.



###Admin portal

####Users

**GET**: /admin/users/

A list of all the users.

**GET**: /admin/users/{ID}

Gives the userdata of userid {ID}

**GET**: /admin/users/{ID}/delete

Deletes the user with this ID.

**GET**: /admin/users/{ID}/answers

Gives all answers of userid {ID}<br/>
?display=summary can be added to this statement to get a summary instead of the whole thing.

**POST**: /admin/users

Admins can create new users by posting here.

**POST**: /admin/users/assign

The admin can assign users by posting here.

####Exercises

**GET**: /admin/exercises

This gives all the exercises.

**GET**: /admin/exercises/{ID}

This gives a specific exercise.

**GET**: /admin/exercises/{ID}/answers

This gives all the answers of the exercise with ID: {ID}

**GET**: /admin/exercises/{ID}/delete

This deletes the exercise with ID: {ID}

**POST**: /admin/exercises

The admin can create exercises by posting here.

**POST**: /admin/exercises/{ID}/edit

The admin can edit exercises by posting here.

####Answers

**GET**: /admin/answers

This gives all answers.

**GET**: /admin/answers/revised

This gives all unrevised answers.

**GET**: /admin/answers/unrevised

This gives all revised answers.

**GET**: /admin/answers/{ID}

This gives a specific answer.

**GET**: /admin/answers/{ID}/delete

This deletes the answer with ID: {ID}

**POST**: /admin/answers/edit

The admin can edit multiple answers by posting here.

**POST**: /admin/answers/{ID}/edit

The admin can edit answers by posting here.



###Statistics portal

**GET**: /statistics/

Gives various numbers on the amount of users, admins, exercises, answers and users per class.

**GET**: /statistics/graph

Gives the week information about all answers.<br/>
?filter=year or ?filter=week to filter the exercises by year or week.

**GET**: /statistics/course/{COURSE}

Gives the information about all courses, includes top users in both amount of answers & received score.<br/>
?limit=# to receive the top # users.

**GET**: /statistics/users/mine

Gives summary about the current user, includes received scores for all answered exercises, activity by week & hour, logins compared to the average.

**GET**: /statistics/users/{ID}

Gives summary about all this user, includes received scores for all answered exercises, activity by week & hour, logins compared to the average.
?filter=year or ?filter=week to filter the exercises by year or week.

**GET**: /statistics/exercises

Gives the amount of exercises and amount of exercises per class.

**GET**: /statistics/exercises/{ID}/graph

Gives summaries about when users solved this exercise that can be used in a fancy graph.<br/>
?filter=year or ?filter=week to filter the exercises by year or week.

**GET**: /statistics/exercises/{ID}/average

Gives summary about the average score from this exercise that can be used in a fancy graph. (excludes unrevised answers)
?limit=# to receive the top # users.

**GET**: /statistics/answers

Gives the amount of answers and the amount of answers solved per class.

**GET**: /statistics/answers/revised

Gives the amount of answers that have been revised and amount of revised answers per class.

**GET**: /statistics/answers/unrevised

Gives the amount of answers that have not been revised yet and amount of unrevised answers per class.
