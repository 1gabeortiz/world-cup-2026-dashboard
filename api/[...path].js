const UPSTREAM_BASE_URL = 'https://api.football-data.org/v4';

function getApiToken() {
  return process.env.FOOTBALL_DATA_API_KEY || process.env.VITE_FD_API_KEY || '';
}

function buildUpstreamUrl(pathParam, query) {
  const segments = Array.isArray(pathParam) ? pathParam : pathParam ? [pathParam] : [];
  const pathname = segments.join('/');
  const url = new URL(`${UPSTREAM_BASE_URL}/${pathname}`);

  for (const [key, value] of Object.entries(query)) {
    if (key === 'path' || value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item != null) url.searchParams.append(key, String(item));
      }
      continue;
    }
    url.searchParams.set(key, String(value));
  }

  return url;
}

export default async function handler(req, res) {
  const token = getApiToken();

  if (!token) {
    res.status(500).json({
      error:
        'Missing football-data API token. Set FOOTBALL_DATA_API_KEY in Vercel project environment variables.',
    });
    return;
  }

  const upstreamUrl = buildUpstreamUrl(req.query.path, req.query);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
        Accept: 'application/json',
      },
    });

    const contentType = upstreamResponse.headers.get('content-type') || 'application/json';
    const upstreamBody = await upstreamResponse.text();

    // Short CDN cache for non-live data, while still allowing quick refreshes.
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=120');
    res.setHeader('Content-Type', contentType);
    res.status(upstreamResponse.status).send(upstreamBody);
  } catch {
    res.status(502).json({
      error: 'Unable to reach football-data.org upstream service.',
    });
  }
}
