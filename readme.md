# BandoMap
> A web app which shows local flying spots suggested by local pilots

### Installing
Built using Node.JS and the Express framework. All dependencies can be seen in the `package.json` file.
```
$ git clone https://github.com/mAzurkovic/BandoMap.git
$ cd BandoMap
$ npm install
```

### Running
1. Start the MongoDB server
2. Start the app `$ nodemon `

#### Regarding the database
This project uses MongoDB, and uses mongoose to interface with it. Make sure you create a new database and replace the connection statement in the `app.js` file: `mongoose.connect('mongodb://<your-db-location>');`

#### Regarding the Google Maps API
Remember to add your API key to the `index.hbs` file.
