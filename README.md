# crud api
## [link to the task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

### .env file is included in git just to make you more easy to test it, in real apps it should be ignored by vcs


- controllers/: This directory holds the logic for handling requests and responses. For a CRUD application, you might have functions to create, read, update, and delete resources, such as users.

- models/: This folder contains representations of the data structures, often mirroring database schemas. In a non-Express 
project, it might simply consist of classes or functions that perform the necessary operations on the data.

- routes/: Here, you define the URL endpoints of your application and associate them with the corresponding controller functions.

- views/: If your application serves HTML, this directory can contain your HTML templates or static files.

- utils/: A place for shared utilities such as database connection modules or middleware-like functions if you choose to implement them.

- server.js: The entry point of your application. This file will set up the HTTP server, handle routing by requiring the routes from routes/, and listen on a port.
