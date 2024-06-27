const express = require('express');

const {
  httpGetAllLaunches,
  httpGetLaunchById,
  httpPostLaunch,
  httpDeleteLaunch,
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.get('/:id', httpGetLaunchById);
launchesRouter.post('/', httpPostLaunch);
launchesRouter.delete('/:id', httpDeleteLaunch);

module.exports = launchesRouter;
