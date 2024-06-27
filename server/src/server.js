const http = require('http');
const app = require('./app');
require('dotenv').config();

const { mongoConnect } = require('./services/mongo');
const PORT = process.env.PORT || 8000;

const { loadPlanetData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const server = http.createServer(app);

const startServer = async () => {
  await mongoConnect();
  await loadPlanetData();
  await loadLaunchesData();

  // Listen to the requests
  server.listen(PORT, () =>
    console.log(`Server is listening at PORT ${PORT}...`)
  );
};

startServer();
