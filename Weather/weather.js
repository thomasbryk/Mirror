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
    var query = { 'location': 'ottawa,on', 'format': 'json' };
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
}