export async function fetchFromRaindropApi(apiKey: string, path: string) {
  const response = await fetch(`https://api.raindrop.io/rest/v1${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Raindrop API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
