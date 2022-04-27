# ManyMeet

A scheduling tool for event organizers that need to manage and facilitate meetings for groups of people.

## Tech stack
### Backend
 - Postgres db
 - Mikro-ORM
 - NestJS

 ### Frontend
 - Angular 2

## Contributing
There are plenty of open issues and additional functionality documented in the Github issues tab. 

## Running the app. 
0. Install `server/` requirements with  `npm i` and install `client/` requirements with `npm i`.
1. Add a `server/.env` file with the credentials. See `server/.env.example` for reference.
2. From the server folder run `npm run start:dev`
3. Ensure that the db was created properly. 
4. From the client folder run `ng serve`

