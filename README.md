# Project Cloud Applications CodeGenie

The idea of this project is invented by Tim Dams.

He wanted a platform that he could use for the labo's of his programming courses. This platform will be used as an exercise panel. The admin has the possibility to add exercises. The users can solve this exercises. After this the admin can revise this answers with points.
The idea is that the student will be more enthusiast to make extra exercises.

There will be statistics so the admin can follow the activity of the users, the users will also be possible to view their own progression. 

At a later stage it would be nice if we have an auto correct feature. The user would than get feedback immediately. If this works, we have made our own capture the flag software.

Of course we have to make it a functional web application. This means using a database where we can store our data. This will be user data (name, password), exercise data and answer data. We also need a good framework, making this in simple javascript / html would be a hell to maintain. We choose for the MEAN stack. Which mean we will use: 

* M: MongoDB => Our database
* E: Express => Webserver module for NodeJS
* A: AngularJS => Our MVC Javascript framework
* N: NodeJS => Our back end Javascript framework

We will develop a REST API, that we can use for easy communication between front-end and back-end. We also have to add a sign-in page, and keep tracking if the user is signed in (cookies). Another problem is *responsive*. A web application is used an many different screen resolutions. We will use Bootstrap to make our lives a lot easier, it's a nice framework to design website compatible with small screens (phone, tablet, ...).

Maintained by
- Brecht Carlier
- Matthew Berkvens
- Arne Schoonvliet

#CodeGenie_NodeJS
This is the folder where our project lives

#Requirements
Folder where we will put the demands of our client / customer

#TestSamples
Folder where we test code. And experiment with some modules / snippets
If we like it, it will be merged in our project.
