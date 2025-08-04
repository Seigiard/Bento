const KELVIN = 273.15;
const DEFAULT_UNIT = "C";

export const TTL_TIME = 1000 * 60 * 60; // 1 hour

export type ForecastDataType = {
	unit: string;
	temperature: number | string;
	description?: string | null;
	icon: string;
};

export const defaultValue: ForecastDataType = {
	unit: DEFAULT_UNIT,
	temperature: "--",
	description: null,
	icon: "unknown",
};

export async function getForecast({
	fallbackLatitude,
	fallbackLongitude,
	apiKey,
	language,
	unit = DEFAULT_UNIT,
}: {
	fallbackLatitude?: string;
	fallbackLongitude?: string;
	apiKey?: string;
	language?: string;
	unit?: string;
} = {}): Promise<ForecastDataType | undefined> {
	async function getDefaultLocationForesast() {
		if (fallbackLatitude && fallbackLongitude) {
			console.error("Geolocation not available. Fetching default location.");
			return fetchAndParseForecastData({
				latitude: fallbackLatitude,
				longitude: fallbackLongitude,
				apiKey,
				language,
				unit,
			});
		} else {
			console.error("Geolocation not available. No default location set.");
		}
	}

	try {
		const { latitude, longitude } = await getCurrentPosition();

		if (latitude && longitude) {
			return fetchAndParseForecastData({
				latitude,
				longitude,
				apiKey,
				language,
				unit,
			});
		}

		return getDefaultLocationForesast();
	} catch (_e) {
		return getDefaultLocationForesast();
	}
}

export async function getCurrentPosition(): Promise<{
	latitude: string;
	longitude: string;
}> {
	return new Promise((resolve, reject) => {
		if (!navigator.geolocation) {
			reject("Geolocation not available");
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				resolve({
					latitude: pos.coords.latitude.toFixed(3),
					longitude: pos.coords.longitude.toFixed(3),
				});
			},
			(err) => {
				reject(err);
			},
		);
	});
}

async function fetchAndParseForecastData({
	latitude,
	longitude,
	apiKey,
	language,
	unit,
}: {
	latitude: string;
	longitude: string;
	apiKey?: string;
	language?: string;
	unit?: string;
}): Promise<ForecastDataType | undefined> {
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${language}&appid=${apiKey}`;
	return fetch(url)
		.then((r) => r.json())
		.then((data) => parseForecastData(data, unit));
}

function parseForecastData(data, unit = DEFAULT_UNIT): ForecastDataType {
	const weather = {} as ForecastDataType;
	let celsius = Math.floor(data.main.temp - KELVIN);

	weather.unit = unit;
	weather.temperature = unit == "C" ? celsius : (celsius * 9) / 5 + 32;
	weather.description = data.weather[0].description;
	weather.icon = data.weather[0].icon ?? "unknown";

	return weather;
}
