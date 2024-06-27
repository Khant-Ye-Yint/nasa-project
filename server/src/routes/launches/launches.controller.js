const {
  getAllLaunches,
  getLaunchById,
  scheduleNewLaunch,
  launchExistWithId,
  deleteLaunchById,
} = require('../../models/launches.model.js');

const { getPagination } = require('../../services/query.js');

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);

  const launches = await getAllLaunches(skip, limit);

  res.status(200).json(launches);
};

const httpGetLaunchById = async (req, res) => {
  res.status(200).json(await getLaunchById(req.params.id));
};

const httpPostLaunch = async (req, res) => {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: 'Missing launch property',
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date',
    });
  }

  await scheduleNewLaunch(launch);
  res.status(201).json(launch);
};

const httpDeleteLaunch = async (req, res) => {
  const launchId = Number(req.params.id);

  const existLaunch = await launchExistWithId(launchId);

  if (!existLaunch) {
    return res.status(404).json({
      error: 'Launch not found',
    });
  }

  const aborted = await deleteLaunchById(launchId);

  if (!aborted) {
    return res.status(400).json({ error: 'Launch not aborted.' });
  }

  return res.status(200).json(aborted);
};

module.exports = {
  httpGetAllLaunches,
  httpGetLaunchById,
  httpPostLaunch,
  httpDeleteLaunch,
};
