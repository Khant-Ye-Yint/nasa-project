const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 8000;

const { loadPlanetData } = require('./models/planets.model');

const server = http.createServer(app);

const startServer = async () => {
  await loadPlanetData();

  // Listen to the requests
  server.listen(PORT, () =>
    console.log(`Server is listening at PORT ${PORT}...`)
  );
};

startServer();
