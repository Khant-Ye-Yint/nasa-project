const API_ENDPoint = 'http://localhost:8000/v1';

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const res = await fetch(`${API_ENDPoint}/planets`);
  // Load planets and return as JSON.
  return res.json();
}

async function httpGetLaunches() {
  // TODO: Once API is ready.
  const res = await fetch(`${API_ENDPoint}/launches`);
  // Load launches, sort by flight number, and return as JSON.
  const fetchedLaunches = await res.json();
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${API_ENDPoint}/launches`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

async function httpAbortLaunch(id) {
  try {
    return await fetch(`${API_ENDPoint}/launches/${id}`, {
      method: 'delete',
    });
  } catch (err) {
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
