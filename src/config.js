const CONFIG = {
  // General
  name: 'Andrej',

  // Greetings
  greetingMorning: 'Good morning',
  greetingAfternoon: 'Good afternoon',
  greetingEvening: 'Good evening',
  greetingNight: 'Go to Sleep',

  // Weather
  weatherKey: '9e2df1fb216a5477f862b69f1732af0c', // Write here your API Key
  weatherIcons: 'FillSvgColorStatic', // 'FillSvgColor', 'FillSvgColorStatic', 'LineSvgColor', 'LineSvgColorStatic', 'SvgMonochrome'
  weatherUnit: 'C', // 'F', 'C'
  language: 'en', // More languages in https://openweathermap.org/current#multi

  trackLocation: true, // If false or an error occurs, the app will use the lat/lon below
  defaultLatitude: '48.160570069000705',
  defaultLongitude: '17.149771267456032',
};

export default CONFIG;
