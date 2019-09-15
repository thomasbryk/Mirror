var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');

function startTime() {
    var today = new Date();

    var day = days[today.getDay()];
    var month = months[today.getMonth()];
    var num = today.getDate();

    document.getElementById('date').innerHTML = '<p class="date">' + day + ", " + month + " " + num + '<span class="date_ordinal">' + ordinalIndicator(num) + '</span></p>';

    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    min = checkTime(min);
    sec = checkTime(sec);

    var fixedHour = hour;
    if (hour > 12)
        fixedHour = hour - 12;
    else if (hour == 0)
        fixedHour = 12;

    if (hour > 12) {
        document.getElementById('time').innerHTML = '<table><tr><td><p class=time>' + fixedHour + ":" + min + '</p></td><td><p class=small_text>' + sec + '</p><p class=small_text>' + "PM" + '</p></td></tr></table>';
    } else {
        document.getElementById('time').innerHTML = '<table><tr><td><p class=time>' + fixedHour + ":" + min + '</p></td><td><p class=small_text>' + sec + '</p><p class=small_text>' + "AM" + '</p></td></tr></table>';
    }
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) { i = "0" + i }; // add zero in front of numbers < 10
    return i;
}

function ordinalIndicator(dateNumber) {
    if (dateNumber > 3 && dateNumber < 21) return 'th';
    switch (dateNumber % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}