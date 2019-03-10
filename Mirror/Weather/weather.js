// v3.1.0
//Docs at http://simpleweatherjs.com
$(document).ready(function () {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});
function getWeather() {
    $.simpleWeather({
        location: 'Ottawa, ON',
        woeid: '',
        unit: 'c',
        success: function (weather) {
            html = '<h2><i class="icon-' + weather.code + '"><span style="font-size: 30px;">&nbsp;</span></i>';
            if (weather.temp > 30) {
                html += '<span class="hot"> ' + weather.temp + '&deg;' + weather.units.temp + '</span></h2>';
            } else if (weather.temp < -10) {
                html += '<span class="cold"> ' + weather.temp + '&deg;' + weather.units.temp + '</span></h2>';
            } else {
                html += '' + weather.temp + '&deg;' + weather.units.temp + '</h2>';
            }
            html += '<span class=info>';
            html += '<li class="city">' + weather.city + ', ' + weather.region + '</li>';
            html += '<li class="forecastDescription">' + 'Currently ' + weather.currently + ' and feels like ' + ((weather.wind.chill - 32) * (5 / 9) | 0) + '&deg;' + weather.units.temp + '. Todays forecast is ' + weather.forecast[0].text + '.</li>';
            if ((weather.sunrise).charAt(3) == ' ') {
                weather.sunrise = weather.sunrise.slice(0, 2) + "0" + weather.sunrise.slice(2);
            }
            if ((weather.sunset).charAt(3) == ' ') {
                weather.sunset = weather.sunset.slice(0, 2) + "0" + weather.sunset.slice(2);
            }
            html += '<li style="font-size:14pt;"><i2 class="icon-' + 34 + '"></i2> ' + weather.sunrise + '';
            html += '&nbsp&nbsp&nbsp <i2 class="icon-' + 31 + '"></i2> ' + weather.sunset + '</li>';
            html += '</span>';

            html += '<span class=week>';
            html += '<table style="height:100%;">';
            for (var i = 0; i < 5; i++) {
                html += '<tr><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '; font-family:Roboto-Light;"> ' + weather.forecast[i].day + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp&nbsp' + weather.forecast[i].high + '&deg;' + weather.units.temp + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp<i2 class="icon-' + weather.forecast[i].code + '"></i2></td></tr></li>';
            }
            html += '</table></span>';
            $("#weather").html(html);
        },
        error: function (error) {
            $("#weather").html('<li>' + error + '</li>');
        }
    });
};