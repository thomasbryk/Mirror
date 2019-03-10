function startTime() {
    var today = new Date();
    months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
    days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var day = days[today.getDay()];
    var month = months[today.getMonth()];
    var num = today.getDate();
    var year = (today.getFullYear());

    document.getElementById('date').innerHTML = '<p class="date" style="opacity:0.7; padding-top: 20px;">' + day + ", " + month + " " + num + ", " + year +'</p>';

    var hour = today.getHours();
    var min = today.getMinutes();
    var sec = today.getSeconds();
    min = checkTime(min);
    sec = checkTime(sec);
    if (hour > 12){
        document.getElementById('time').innerHTML = '<table><tr><td><p class=time>' + (hour-12) + ":" + min + '</p></td><td><p class=small_text>' + sec + '</p><p class=small_text>' + "PM" + '</p></td></tr></table>';
     } else{
       document.getElementById('time').innerHTML = '<table><tr><td><p class=time>' + hour + ":" + min + '</p></td><td><p class=small_text>' + sec + '</p><p class=small_text>' + "AM" + '</p></td></tr></table>';
    }
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
    return i;
}
