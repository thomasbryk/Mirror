$(document).ready(function () {
    getWeather(); //Get the initial weather.
    setInterval(getWeather, 600000); //Update the weather every 10 minutes.
});

function getWeather() {
    var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
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
    var merged_arr = Object.keys(merged).sort().map(function (k) {
        return [k + '=' + encodeURIComponent(merged[k])];
    });
    var signature_base_str = method
        + concat + encodeURIComponent(url)
        + concat + encodeURIComponent(merged_arr.join(concat));

    var composite_key = encodeURIComponent(consumer_secret) + concat;
    var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
    var signature = hash.toString(CryptoJS.enc.Base64);

    oauth['oauth_signature'] = signature;
    var auth_header = 'OAuth ' + Object.keys(oauth).map(function (k) {
        return [k + '="' + oauth[k] + '"'];
    }).join(',');

    $.ajax({
        url: url + '?' + $.param(query),
        headers: {
            'Authorization': auth_header,
            'X-Yahoo-App-Id': app_id
        },
        method: 'GET',
        success: function (weather) {
            console.log(weather);
            html = '<h2><i class="wi wi-yahoo-' + weather.current_observation.condition.code + '"><span style="font-size: 30px;">&nbsp;</span></i>';
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
            html += '<li class="sunRiseSet"><i2 class="wi-yahoo-' + 34 + '"></i2> ' + weather.current_observation.astronomy.sunrise + '';
            html += '&nbsp&nbsp&nbsp <i2 class="wi-yahoo-' + 31 + '"></i2> ' + weather.current_observation.astronomy.sunset + '</li>';
            html += '</span>';

            html += '<span class=week>';
            html += '<table style="height:100%;">';
            for (var i = 0; i < 5; i++) {
                html += '<tr><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '"> ' + weather.forecasts[i].day + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp&nbsp' + weather.forecasts[i].high + '&deg;' + units + '</td><td class=weekTD><li style="opacity:' + 1 / (i * 1.5) + '">&nbsp<i2 class="wi-yahoo-' + weather.forecasts[i].code + '"></i2></td></tr></li>';
            }
            html += '</table></span>';
            $("#weather").html(html);
        },
        error: function (error) {
            $("#weather").html('<li>' + error + '</li>');
        }
    });
}