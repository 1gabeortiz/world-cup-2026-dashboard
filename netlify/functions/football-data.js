const UPSTREAM_BASE_URL = 'https://api.football-data.org/v4';

function getApiToken() {
  return process.env.FD_API_KEY || process.env.FOOTBALL_DATA_API_KEY || '';
}

function createUpstreamUrl(event) {
  const path = event.queryStringParameters?.path || '';
  const normalizedPath = path
    .split('/')
    .filter(Boolean)
    .join('/');

  const url = new URL(`${UPSTREAM_BASE_URL}/${normalizedPath}`);
  const queryParams = event.queryStringParameters || {};

  for (const [key, value] of Object.entries(queryParams)) {
    if (key === 'path' || value == null) continue;
    url.searchParams.set(key, String(value));
  }

  return url;
}

export async function handler(event) {
  const token = getApiToken();

  if (!token) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error:
          'Missing football-data API token. Set FOOTBALL_DATA_API_KEY in Netlify environment variables.',
      }),
    };
  }

  try {
    const upstreamUrl = createUpstreamUrl(event);
    const response = await fetch(upstreamUrl, {
      headers: {
        'X-Auth-Token': token,
        Accept: 'application/json',
      },
    });

    const body = await response.text();
    const contentType = response.headers.get('content-type') || 'application/json';

    return {
      statusCode: response.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=120',
      },
      body,
    };
  } catch {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Unable to reach football-data.org upstream service.',
      }),
    };
  }
}
