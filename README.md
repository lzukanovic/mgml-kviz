# Running the project

## Development
1. Have a local postgres DB running.
2. In the `server` directory create a `.env` file where you must add the following postgres variable:

   ```
   HOST=localhost # host of the postgres DB, if it is run locally, leave localhost
   USER=<username>
   PASSWORD=<password>
   DB=<name>
   DIALECT=postgres # always this value
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
