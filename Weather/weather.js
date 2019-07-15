var API_KEY = '0059287a1f10d4f818f22bc07882e6ae';


$(document).ready(function() {
    html = '<h2><i class="wi wi-owm-200"><span style="font-size: 30px;">&nbsp;</span></i>';
    $("#weather").html(html);
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

function getWeather() {
    getCurrentWeather();
    //getWeekWeather();
}

function getCurrentWeather() {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/weather',
        data: {
            zip: 'K2C1N5,ca',
            units: 'metric',
            APPID: API_KEY
        },
        success: weather => {
            console.log(weather["main"]["temp"] + " C");
        }
    })
}

function getWeekWeather() {
    $.ajax({
        url: 'http://api.openweathermap.org/data/2.5/forecast',
        data: {
            zip: 'K2C1N5,ca',
            units: 'metric',
            APPID: API_KEY
        },
        success: weather => {
            console.log(weather["main"]["temp"] + " C");
            console.log("Condition Code: " + getConditionCode(weather[0].id));
        }
    })
}

function getConditionCode(code) {
    var prefix = 'wi wi-';
    var icon = weatherIcons[code].icon;

    // If we are not in the ranges mentioned above, add a day/night prefix.
    if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
        icon = 'day-' + icon;
    }

    // Finally tack on the prefix.
    return icon = prefix + icon;
}

function getWeather() {
    var url = 'api.openweathermap.org';
    var method = 'GET';
    var app_id = 'P12LqJ7k';
    var consumer_key = 'dj0yJmk9UlJsbnBQTks0SGdQJnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWFm';
    var consumer_secret = 'c25c0605b09e1f4502e285b97615d33ed4e85227';
    var concat = '&';
    var units = 'c';
    var query = { 'location': 'ottawa,on', 'format': 'json', 'u': units };
    var oauth = {
        'oauth_consumer_key': consumer_key,
        'oauth_nonce': Math.random().toString(36).substring(2),
        'oauth_signature_method': 'HMAC-SHA1',
        'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
        'oauth_version': '1.0'
    };

    var merged = {};
    $.extend(merged, query, oauth);
    // Note the sorting here is required
    var merged_arr = Object.keys(merged).sort().map(function(k) {
        return [k + '=' + encodeURIComponent(merged[k])];
    });
    var signature_base_str = method +
        concat + encodeURIComponent(url) +
        concat + encodeURIComponent(merged_arr.join(concat));

    var composite_key = encodeURIComponent(consumer_secret) + concat;
    var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    var signature = hash.toString(CryptoJS.enc.Base64);

    oauth['oauth_signature'] = signature;
    var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
        return [k + '="' + oauth[k] + '"'];
    }).join(',');

    $.ajax({
        url: url + '?' + $.param(query),
        headers: {
            'Authorization': auth_header,
            'X-Yahoo-App-Id': app_id
        },
        method: 'GET',
        success: function(weather) {
            console.log(weather);
            html = '<h2><i class="wi-yahoo-' + weather.current_observation.condition.code + '"><span style="font-size: 30px;">&nbsp;</span></i>';
            if (weather.current_observation.condition.temperature > 30) {
                html += '<span class="hot"> ' + weather.current_observation.condition.temperature + '&deg;' + units + '</span></h2>';
            } else if (weather.current_observation.condition.temperature < -10) {
                html += '<span class="cold"> ' + weather.current_observation.condition.temperature + '&deg;' + units + '</span></h2>';
            } else {
                html += '' + weather.current_observation.condition.temperature + '&deg;' + units + '</h2>';
            }
            html += '<span class=info>';
            html += '<li class="city">' + weather.location.city + ', ' + weather.location.region + '</li>';
            html += '<li class="forecastDescription">' + 'Currently ' + weather.current_observation.condition.text.toLowerCase() + ' and feels like ' + weather.current_observation.wind.chill + '&deg;' + units + '. Today&#39s forecast is ' + weather.forecasts[0].text.toLowerCase() + '.</li>';
            if ((weather.current_observation.astronomy.sunrise).charAt(3) == ' ') {
                weather.current_observation.astronomy.sunrise = weather.current_observation.astronomy.sunrise.slice(0, 2) + "0" + weather.current_observation.astronomy.sunrise.slice(2);
            }
            if ((weather.current_observation.astronomy.sunset).charAt(3) == ' ') {
                weather.current_observation.astronomy.sunset = weather.current_observation.astronomy.sunset.slice(0, 2) + "0" + weather.current_observation.astronomy.sunset.slice(2);
            }
            html += '<li class="sunRiseSet"><i2 class="wi-sunrise"></i2> ' + weather.current_observation.astronomy.sunrise + '';
            html += '&nbsp&nbsp&nbsp <i2 class="wi-moonrise"></i2> ' + weather.current_observation.astronomy.sunset + '</li>';
            html += '</span>';

            html += '<span class=week>';
            html += '<table style="height:100%;">';
            for (var i = 0; i < 5; i++) {
                html += '<tr><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '"> ' + weather.forecasts[i].day + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp&nbsp' + weather.forecasts[i].high + '&deg;' + units + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp<i2 class="wi-yahoo-' + weather.forecasts[i].code + '"></i2></td></tr></li>';
            }
            html += '</table></span>';
            $("#weather").html(html);
        },
        error: function(error) {
            $("#weather").html('<li>' + error + '</li>');
        }
    });
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