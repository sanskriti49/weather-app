import sun from "../images/sun.png";
import mostlyClear from "../images/mostlyclear.png";
import cloudySun from "../images/cloudysun.png";
import clouds from "../images/clouds.png";
import fog from "../images/fog.png";
import drizzle from "../images/drizzle.png";
import rain from "../images/rain.png";
import thunder from "../images/thunder.png";
import freezingRain from "../images/freezing_rain.png";
import snow from "../images/snow.png";
import thunderHail from "../images/thunderstorm_hail.png";

export const getWeatherDetails = (code) => {
	const weatherMap = {
		0: { img: sun, desc: "Sunny" },
		1: { img: mostlyClear, desc: "Mostly Clear" },
		2: { img: cloudySun, desc: "Partly Cloudy" },
		3: { img: clouds, desc: "Overcast" },
		45: { img: fog, desc: "Foggy" },
		48: { img: fog, desc: "Freezing Fog" },
		51: { img: drizzle, desc: "Light Drizzle" },
		53: { img: drizzle, desc: "Moderate Drizzle" },
		55: { img: drizzle, desc: "Heavy Drizzle" },
		61: { img: rain, desc: "Light Rain" },
		63: { img: rain, desc: "Moderate Rain" },
		65: { img: thunder, desc: "Heavy Rain" },
		66: { img: freezingRain, desc: "Light Freezing Rain" },
		67: { img: freezingRain, desc: "Heavy Freezing Rain" },
		71: { img: snow, desc: "Light Snow" },
		73: { img: snow, desc: "Moderate Snow" },
		75: { img: snow, desc: "Heavy Snow" },
		77: { img: snow, desc: "Snow Flurries" },
		80: { img: rain, desc: "Light Showers" },
		81: { img: rain, desc: "Moderate Showers" },
		82: { img: rain, desc: "Heavy Showers" },
		85: { img: snow, desc: "Light Snow Showers" },
		86: { img: snow, desc: "Heavy Snow Showers" },
		95: { img: thunder, desc: "Light Thunderstorm" },
		96: { img: thunderHail, desc: "Light Thunderstorm w/ Hail" },
		99: { img: thunderHail, desc: "Heavy Thunderstorm w/ Hail" },
	};

	return weatherMap[code] || { img: sun, desc: "Unknown" };
};
