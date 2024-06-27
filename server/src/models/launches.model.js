const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

// const launch = {
//   flightNumber: 100, flight_number
//   mission: 'Kepler Exploration X', name
//   rocket: 'Explorer IS1', rocket.name
//   launchDate: new Date('December 27, 2030'), date_local
//   target: 'Kepler-442 b',  // not applicable
//   customers: ['ZTM', 'NASA'],
//   upcoming: true,  upcoming
//   success: true, success
// };

const populateLaunches = async () => {
  console.log('Downloading launch data...');
  const res = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1,
          },
        },
        {
          path: 'payloads',
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (res.status != 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed.');
  }

  const launchDocs = res.data.docs;

  launchDocs.forEach(async (doc) => {
    const payloads = doc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: doc['flight_number'],
      mission: doc['name'],
      rocket: doc['rocket']['name'],
      launchDate: doc['date_local'],
      upcoming: doc['upcoming'],
      success: doc['success'],
      customers,
    };

    console.log(`${launch.flightNumber} ${launch.mission}`);

    await saveLaunch(launch);
  });
};

const saveLaunch = async (launch) => {
  try {
    await launches.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.error(`Could not save launch ${err}`);
  }
};

// saveLaunch(launch);

const loadLaunchesData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });

  if (firstLaunch) {
    console.log('Launch data already loaded');
    return;
  } else {
    populateLaunches();
  }
};

const findLaunch = async (filter) => {
  return await launches.findOne(filter);
};

const getAllLaunches = async (skip, limit) => {
  return await launches
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const launchExistWithId = async (launchId) => {
  return await findLaunch({ flightNumber: launchId });
};

const getLaunchById = async (id) => {
  return await launches.findOne({ _id: id });
};

const scheduleNewLaunch = async (launch) => {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error('Invalid target planet');
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    success: true,
    upcomming: true,
    customers: ['Wukong', 'Sama'],
  });

  await saveLaunch(newLaunch);
};

const deleteLaunchById = async (id) => {
  try {
    return await launches.updateOne(
      {
        flightNumber: id,
      },
      {
        upcomming: false,
        success: false,
      }
    );
  } catch (err) {
    console.error(`Could not save launch ${err}`);
  }
};

const getLatestFlightNumber = async () => {
  const latestLaunch = await launches.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
};

module.exports = {
  getAllLaunches,
  getLaunchById,
  scheduleNewLaunch,
  launchExistWithId,
  deleteLaunchById,
  loadLaunchesData,
};
