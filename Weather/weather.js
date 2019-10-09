const API_KEY = '0059287a1f10d4f818f22bc07882e6ae';
const UNITS = 'metric';
const LAT = '45.369910';
const LON = '-75.701720';
const ZIP = 'K2C1N5,ca'

$(document).ready(function() {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

function getWeather() {
    var html = "";
    html += getCurrentWeather(html);
    $("#weather").html(html);
}

function getCurrentWeather(html) {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        data: {
            lat: LAT,
            lon: LON,
            // zip: ZIP,
            units: UNITS,
            APPID: API_KEY
        },
        success: weather => {
            console.log("Current Weather: ");
            console.log(weather);
            if (weather == null) {
                html += '<h2>Unable to get current weather.</h2>';
            } else {
                html += getWeekWeather(weather, html);
            }
            return html;
        },
        error: function(error) {
            return error;
        }
    })
}

function getWeekWeather(weather, html) {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast',
        data: {
            lat: LAT,
            lon: LON,
            // zip: ZIP,
            units: UNITS,
            APPID: API_KEY
        },
        success: forecast => {
            console.log("Forecast: ");
            console.log(forecast);
            if (forecast == null) {
                html += '<h2>Unable to get forecast.</h2>';
            } else {
                html += displayWeather(weather, forecast, html);
            }
            return html;
        },
        error: function(error) {
            return error;
        }
    })
}

function displayWeather(weather, forecast, html) {
    //html += '<h2><i class="' + getFontFromConditionCode(weather) + '"><span style="font-size: 30px;">&nbsp;</span></i>';
    if (weather.main.temp > 30) {
        html += '<span class="hot"> ' + weather.main.temp + '&deg;' + UNITS + '</span></h2>';
    } else if (weather.main.temp < -10) {
        html += '<span class="cold"> ' + weather.main.temp + '&deg;' + UNITS + '</span></h2>';
    } else {
        html += '' + weather.main.temp + '&deg;' + UNITS + '</h2>';
    }
    html += '<span class=info>';
    html += '<li class="city">' + weather.name + ', ' + (weather.name == "Ottawa" || weather.name == "Niagara Falls" ? 'ON' : weather.sys.country) + '</li>';
    html += '<li class="forecastDescription">' + 'Currently ' + weather.weather[0].main.toLowerCase() + ' and feels like ' + getFeelsLike(weather.wind.speed, weather.main.temp, weather.main.humidity, UNITS) + '&deg;' + UNITS + /*'. Today&#39s forecast is ' + weather.forecasts[0].text.toLowerCase() + */ '.</li>';

    // if ((weather.main.astronomy.sunrise).charAt(3) == ' ') {
    //     weather.main.astronomy.sunrise = weather.main.astronomy.sunrise.slice(0, 2) + "0" + weather.main.astronomy.sunrise.slice(2);
    // }
    // if ((weather.main.astronomy.sunset).charAt(3) == ' ') {
    //     weather.main.astronomy.sunset = weather.main.astronomy.sunset.slice(0, 2) + "0" + weather.main.astronomy.sunset.slice(2);
    // }
    html += '<li class="sunrise_sunset"><i2 class="wi-sunrise"></i2> ' + convertUnixTime(weather.sys.sunrise) + '';
    html += '&nbsp&nbsp&nbsp <i2 class="wi-moonrise"></i2> ' + convertUnixTime(weather.sys.sunset) + '</li>';
    html += '</span>';

    // html += '<span class=week>';
    // html += '<table style="height:100%;">';
    // for (var i = 0; i < 5; i++) {
    //     html += '<tr><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '"> ' + weather.forecasts[i].day + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp&nbsp' + weather.forecasts[i].high + '&deg;' + UNITS + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp<i2 class="wi-yahoo-' + weather.forecasts[i].code + '"></i2></td></tr></li>';
    // }
    // html += '</table></span>';

    return html;
}

function getFontFromConditionCode(weather) {
    var code = weather.weather[0].id;
    console.log(code);
    console.log(weather.weather);
    var prefix = 'wi wi-owm-';

    // If condition code is 'clear sky' or 'few clouds', add day/night to prefix
    // if (code == 800 || code == 801) {
    //     var sunset = new Date(weather["sys"].sunset * 1000);
    //     var sunrise = new Date(weather["sys"].sunrise * 1000)
    //     var today = new Date();

    //     //If it is night time (either before sunrise or after sunset)
    //     if (today < sunrise || today > sunset) {
    //         prefix += 'night-';
    //     } else {
    //         prefix += 'day-';
    //     }
    // }

    // Finally tack on the condition code.
    return prefix + code;
}

function getFeelsLike(windspeed, temp, humidity, units) {
    const windInMph = (this.windUnits === "imperial") ? this.windSpeed : this.windSpeed * 2.23694;
    const tempInF = this.tempUnits === "imperial" ? this.temperature : this.temperature * 9 / 5 + 32;
    let feelsLike = tempInF;

    if (windInMph > 3 && tempInF < 50) {
        feelsLike = Math.round(35.74 + 0.6215 * tempInF - 35.75 * Math.pow(windInMph, 0.16) + 0.4275 * tempInF * Math.pow(windInMph, 0.16));
    } else if (tempInF > 80 && this.humidity > 40) {
        feelsLike = -42.379 + 2.04901523 * tempInF + 10.14333127 * this.humidity -
            0.22475541 * tempInF * this.humidity - 6.83783 * Math.pow(10, -3) * tempInF * tempInF -
            5.481717 * Math.pow(10, -2) * this.humidity * this.humidity +
            1.22874 * Math.pow(10, -3) * tempInF * tempInF * this.humidity +
            8.5282 * Math.pow(10, -4) * tempInF * this.humidity * this.humidity -
            1.99 * Math.pow(10, -6) * tempInF * tempInF * this.humidity * this.humidity;
    }

    return this.tempUnits === "imperial" ? feelsLike : (feelsLike - 32) * 5 / 9;
}

function convertUnixTime(unix_timestamp) {
    var date = new Date(unix_timestamp * 1000); // Create a new JavaScript Date object based on the timestamp multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var hours = date.getHours(); // Hours part from the timestamp  
    var minutes = "0" + date.getMinutes(); // Minutes part from the timestamp

    return hours + ':' + minutes.substr(-2); // Will display time in 10:30 format
}

var weatherIcons = {
    "200": {
        "label": "thunderstorm with light rain",
        "icon": "storm-showers"
    },

    "201": {
        "label": "thunderstorm with rain",
        "icon": "storm-showers"
    },

    "202": {
        "label": "thunderstorm with heavy rain",
        "icon": "storm-showers"
    },

    "210": {
        "label": "light thunderstorm",
        "icon": "storm-showers"
    },

    "211": {
        "label": "thunderstorm",
        "icon": "thunderstorm"
    },

    "212": {
        "label": "heavy thunderstorm",
        "icon": "thunderstorm"
    },

    "221": {
        "label": "ragged thunderstorm",
        "icon": "thunderstorm"
    },

    "230": {
        "label": "thunderstorm with light drizzle",
        "icon": "storm-showers"
    },

    "231": {
        "label": "thunderstorm with drizzle",
        "icon": "storm-showers"
    },

    "232": {
        "label": "thunderstorm with heavy drizzle",
        "icon": "storm-showers"
    },

    "300": {
        "label": "light intensity drizzle",
        "icon": "sprinkle"
    },

    "301": {
        "label": "drizzle",
        "icon": "sprinkle"
    },

    "302": {
        "label": "heavy intensity drizzle",
        "icon": "sprinkle"
    },

    "310": {
        "label": "light intensity drizzle rain",
        "icon": "sprinkle"
    },

    "311": {
        "label": "drizzle rain",
        "icon": "sprinkle"
    },

    "312": {
        "label": "heavy intensity drizzle rain",
        "icon": "sprinkle"
    },

    "313": {
        "label": "shower rain and drizzle",
        "icon": "sprinkle"
    },

    "314": {
        "label": "heavy shower rain and drizzle",
        "icon": "sprinkle"
    },

    "321": {
        "label": "shower drizzle",
        "icon": "sprinkle"
    },

    "500": {
        "label": "light rain",
        "icon": "rain"
    },

    "501": {
        "label": "moderate rain",
        "icon": "rain"
    },

    "502": {
        "label": "heavy intensity rain",
        "icon": "rain"
    },

    "503": {
        "label": "very heavy rain",
        "icon": "rain"
    },

    "504": {
        "label": "extreme rain",
        "icon": "rain"
    },

    "511": {
        "label": "freezing rain",
        "icon": "rain-mix"
    },

    "520": {
        "label": "light intensity shower rain",
        "icon": "showers"
    },

    "521": {
        "label": "shower rain",
        "icon": "showers"
    },

    "522": {
        "label": "heavy intensity shower rain",
        "icon": "showers"
    },

    "531": {
        "label": "ragged shower rain",
        "icon": "showers"
    },

    "600": {
        "label": "light snow",
        "icon": "snow"
    },

    "601": {
        "label": "snow",
        "icon": "snow"
    },

    "602": {
        "label": "heavy snow",
        "icon": "snow"
    },

    "611": {
        "label": "sleet",
        "icon": "sleet"
    },

    "612": {
        "label": "shower sleet",
        "icon": "sleet"
    },

    "615": {
        "label": "light rain and snow",
        "icon": "rain-mix"
    },

    "616": {
        "label": "rain and snow",
        "icon": "rain-mix"
    },

    "620": {
        "label": "light shower snow",
        "icon": "rain-mix"
    },

    "621": {
        "label": "shower snow",
        "icon": "rain-mix"
    },

    "622": {
        "label": "heavy shower snow",
        "icon": "rain-mix"
    },

    "701": {
        "label": "mist",
        "icon": "sprinkle"
    },

    "711": {
        "label": "smoke",
        "icon": "smoke"
    },

    "721": {
        "label": "haze",
        "icon": "day-haze"
    },

    "731": {
        "label": "sand, dust whirls",
        "icon": "cloudy-gusts"
    },

    "741": {
        "label": "fog",
        "icon": "fog"
    },

    "751": {
        "label": "sand",
        "icon": "cloudy-gusts"
    },

    "761": {
        "label": "dust",
        "icon": "dust"
    },

    "762": {
        "label": "volcanic ash",
        "icon": "smog"
    },

    "771": {
        "label": "squalls",
        "icon": "day-windy"
    },

    "781": {
        "label": "tornado",
        "icon": "tornado"
    },

    "800": {
        "label": "clear sky",
        "icon": "sunny"
    },

    "801": {
        "label": "few clouds",
        "icon": "cloudy"
    },

    "802": {
        "label": "scattered clouds",
        "icon": "cloudy"
    },

    "803": {
        "label": "broken clouds",
        "icon": "cloudy"
    },

    "804": {
        "label": "overcast clouds",
        "icon": "cloudy"
    },


    "900": {
        "label": "tornado",
        "icon": "tornado"
    },

    "901": {
        "label": "tropical storm",
        "icon": "hurricane"
    },

    "902": {
        "label": "hurricane",
        "icon": "hurricane"
    },

    "903": {
        "label": "cold",
        "icon": "snowflake-cold"
    },

    "904": {
        "label": "hot",
        "icon": "hot"
    },

    "905": {
        "label": "windy",
        "icon": "windy"
    },

    "906": {
        "label": "hail",
        "icon": "hail"
    },

    "951": {
        "label": "calm",
        "icon": "sunny"
    },

    "952": {
        "label": "light breeze",
        "icon": "cloudy-gusts"
    },

    "953": {
        "label": "gentle breeze",
        "icon": "cloudy-gusts"
    },

    "954": {
        "label": "moderate breeze",
        "icon": "cloudy-gusts"
    },

    "955": {
        "label": "fresh breeze",
        "icon": "cloudy-gusts"
    },

    "956": {
        "label": "strong breeze",
        "icon": "cloudy-gusts"
    },

    "957": {
        "label": "high wind, near gale",
        "icon": "cloudy-gusts"
    },

    "958": {
        "label": "gale",
        "icon": "cloudy-gusts"
    },

    "959": {
        "label": "severe gale",
        "icon": "cloudy-gusts"
    },

    "960": {
        "label": "storm",
        "icon": "thunderstorm"
    },

    "961": {
        "label": "violent storm",
        "icon": "thunderstorm"
    },

    "962": {
        "label": "hurricane",
        "icon": "cloudy-gusts"
    }
}