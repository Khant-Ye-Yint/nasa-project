const planets = require('./planets.mongo');

const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

const loadPlanetData = () => {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')
    )
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        const planetsFoundCount = (await getAllPlanets()).length;
        console.log(`${planetsFoundCount} habbitable planets found.`);
        resolve();
      });
  });
};

const getAllPlanets = async () => {
  return await planets.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
};

const savePlanet = async (planet) => {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save planet ${err}`);
  }
};

module.exports = { loadPlanetData, getAllPlanets };
