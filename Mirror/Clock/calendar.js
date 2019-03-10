// Client ID and API key from the Developer Console
var CLIENT_ID = '1080674062554-3ftochhcdnkretsfsie0q4qul328f6fq.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCcJ6WLBCAEVVEh_YaFqnlnOYA7wgaywb4';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('authorize_button');
var signoutButton = document.getElementById('signout_button');

var maxResults = 5;
var totalEventsCount = 0;
var savedEvents = [];
var calendarIcons = {
    "Reminders": "reminder",
    "Friends' Birthdays": "birthday",
    "Thomas Bryk's Facebook Events": 'facebook',
    "School": 'school',
    "Work": 'work',
    "Holidays in Canada": "holiday",
    "Toronto Maple Leafs": "hockey"
}

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
        async: false
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        runCustomIterations();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function listUpcomingEvents(calID, calendar) {
    gapi.client.calendar.events.list({
        'calendarId': calID,
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': maxResults,
        'orderBy': 'startTime',
        'async': false
    }).then(function (response) {
        var events = response.result.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var currEventCalendarItem = { 'event': events[i], 'calendar': calendar };
                savedEvents.push(currEventCalendarItem);
            }
        }

        totalEventsCount = totalEventsCount - (maxResults - events.length);

        if (savedEvents.length == totalEventsCount && savedEvents.length != 0) {
            savedEvents.sort(sortDates);
            console.log(savedEvents);
            displayEvents();
        }
    });
}

function IterateOverCalendars(calendars) {
    totalEventsCount = calendars.length * maxResults;
    for (var i = 0; i < calendars.length; i++) {
        console.log(calendars[i].summary);
        listUpcomingEvents(calendars[i].id, calendars[i])
    }
}

function runCustomIterations() {
    gapi.client.calendar.calendarList.list(
    ).execute(function (resp) {
        IterateOverCalendars(resp.items);
    });
}

function sortDates(eventCalendarItem1, eventCalendarItem2) {
    var event1 = eventCalendarItem1.event.start;
    var event2 = eventCalendarItem2.event.start;
    var dateEvent1, dateEvent2 = null;

    if (event1.date != null)
        dateEvent1 = new Date(event1.date);
    else
        dateEvent1 = new Date(event1.dateTime);

    if (event2.date != null)
        dateEvent2 = new Date(event2.date);
    else
        dateEvent2 = new Date(event2.dateTime);

    if (dateEvent1 > dateEvent2)
        return 1;
    else if (dateEvent1 < dateEvent2)
        return -1;
    else
        return 0;
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

function displayEvents() {
    var pre = document.getElementById('calendar');
    var prevEventDate = null;
    
    if (savedEvents.length >= 4) {
        for (i = 0; i < 5; i++) {
            prevEventDate = callPopulateHTML (pre, prevEventDate, savedEvents[i]);
        }
    }
    else {
        for (i = 0; i < savedEvents.length; i++) {
            prevEventDate = callPopulateHTML (pre, prevEventDate, savedEvents[i]);
        }
    }
}

function callPopulateHTML (pre, prevEventDate, currEvent) {
    var eventDate = new Date(currEvent.event.start.date);
    if (isNaN(eventDate.valueOf()))
        eventDate = new Date(currEvent.event.start.dateTime);

    populateHTML(currEvent, eventDate, prevEventDate, pre);

    return eventDate;
}

function populateHTML(currEvent, eventDate, prevEventDate, pre) {

    var eventDateString = (eventDate.getMonth() + 1) + "/" + (eventDate.getDate());

    if (prevEventDate == null || prevEventDate.getDate() != eventDate.getDate()){
        pre.innerHTML += '<p class="dateLine">' + eventDateString +'</p><hr></br style="font-size:25px">';
    }

    pre.innerHTML += '&nbsp&nbsp'

    if (eventDate.getHours() != null || eventDate.getHours() != ""){
        pre.innerHTML += '<p class="event_text" style="opacity:0.5;">'
    }
    
    pre.innerHTML += '<p class="event_text"><img src="' + getCalendarIcon(currEvent.calendar.summary) + '" class="calIcon">&nbsp&nbsp</p>';
    pre.innerHTML += '<p class="event_text">' + currEvent.event.summary + '</p>';

    var timeText = formatAMPM(eventDate);

    pre.innerHTML += '<p class="time_text">' + timeText + '</p></br>';
}

function getCalendarIcon(calName) {
    return ("Icons/" + calendarIcons[calName] + ".png");
}