rem Place a file with the name connctioninfo.config in the mongoose folder to connect to the database
rem In this file there has to be the connectionstring (mongodb://....)
rem Or change the path! Or hardcode it here...

set /p connection=<mongoose/connectioninfo.config

IF '%connection%' == '' set connection=connectionstring

set db=%connection%
nodemon server.js