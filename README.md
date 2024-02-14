# crud api
## [link to the task](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md)

### .env file is included in git just to make you more easy to test it, in real apps it should be ignored by vcs

commands:
1. npm i
2. npm run start:dev
3. npm run start:prod
4. npm run test
5. npm run start:multi

## tests
You have no need to start dev/prod server for tests, server instance will be created automatically

## endpoints:
 - **GET api/users** is used to get all users
 - **GET api/users/{userId}** is used to get user by id
 - **POST api/users** is used to create record about new user and store it in database
 - **PUT api/users/{userId}** is used to update existing user
 - **DELETE api/users/{userId}** is used to delete existing user from database

Users are stored as objects that have following properties:
- id — unique identifier (string, uuid) generated on server side
- username — user's name (string, required)
- age — user's age (number, required)
- hobbies — user's hobbies (array of strings or empty array, required)
