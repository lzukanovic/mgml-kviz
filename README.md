# Running the project

## Development
1. Have a local postgres DB running.
2. In the `server` directory create a `.env` file where you must add the following postgres variable:

   ```
   HOST=localhost # host of the postgres DB, if it is run locally, leave localhost
   USER=<username>
   PASSWORD=<password>
   DB=<name>
   PG_PORT=5432 # port of the postgres DB, default is 5432
   PORT=3070 # port of the server to run at
   ```
    
3. From the root of the project navigate to `client` directory and run the following:
   
   ```
   npm install
   npm run start
   ```
   
4. From the root of the project navigate to `server` directory and run the following:

   ```
   npm install
   npm run dev
   ```

## Production (Docker)
Project is divided into 3 separate containers: the Angular application, the NodeJS backend, and the postgres database.
We use docker-compose to streamline this multi-container setup.
An additional requirement is to have a `.end.prod` file in the `server` directory that holds all the needed environment variables.

To build and run the containers:
```
docker-compose --env-file ./server/.env.prod build
docker-compose --env-file ./server/.env.prod up -d
```
or the one-liner version
```
docker-compose --env-file ./server/.env.prod up -d --build
```

To stop use:
```
docker-compose --env-file ./server/.env.prod down --volumes
```
The volumes flag should also remove any volumes (e.q. database data). You could use the Docker Desktop application to manage the containers, images, volumes.
