const API_ENDPoint = 'http://localhost:8000';

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const res = await fetch(`${API_ENDPoint}/planets`);
  // Load planets and return as JSON.
  return res.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
