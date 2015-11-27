set /p connection =< mongoose/connectioninfo.config

IF '%connection%' == '' set connection=connectionstring

set db=%connection%
nodemon server.js