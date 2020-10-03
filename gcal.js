
  // <script type="text/javascript">
    // Client ID and API key from the Developer Console
    var CLIENT_ID = '1045481648151-2gm68lcbtge96ohguvb0t8kn4e86vqju.apps.googleusercontent.com';
    var API_KEY = 'AIzaSyB_i3p4BenyPHb2rVgL6awGm5Q0TXZMTOQ';

    // Array of API discovery doc URLs for APIs used by the quickstart
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    var authorizeButton = document.getElementById('authorize_button');
    console.log(authorizeButton);
    var signoutButton = document.getElementById('signout_button');

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
        scope: SCOPES
      }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get(), gapi.auth2.getAuthInstance());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      }, function (error) {
        appendPre(JSON.stringify(error, null, 2));
      });
    }

    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn, auth) {
      if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        document.getElementById('email').innerText = auth.currentUser.get().getBasicProfile().getEmail() || ''
        
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

    /**
     * Append a pre element to the body containing the given message
     * as its text node. Used to display the results of the API call.
     *
     * @param {string} message Text to be placed in pre element.
     */
    function appendPre(message) {
      var pre = document.getElementById('events');
      var textContent = document.createTextNode(message + '\n');
      pre.appendChild(textContent);
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
      let dateOld = moment();
      let days = document.getElementById("days").value
      dateOld.subtract(days, "days")
      let date = moment();

      gapi.client.calendar

      let minutes = 0;
      gapi.client.calendar.events.list({
        calendarId: `primary`,
        timeMax: date.toISOString(),
        timeMin: dateOld.toISOString(),
        showDeleted: false,
        showHiddenInvitations: false,
        singleEvents: true
      }).then(function (response) {
        var events = response.result.items;
        console.log(events);


        if (events.length > 0) {
          for (i = 0; i < events.length; i++) {
            var event = events[i];
            var start = moment(event.start.dateTime);
            var end = moment(event.end.dateTime);
            if (event.attendees != undefined) {
              minutes = minutes + end.diff(start, 'minutes')
              appendPre(event.summary + " " + end.diff(start, 'minutes'))
            }else{
              appendPre(`Skipped ${event.summary} does not have attendees`);
            }
          }
          hours = minutes / 60;

          document.getElementById('hours').innerText = hours

        } else {
          appendPre('No events found for the given time frame');
        }
      }).catch(err => console.log(err))
    }
    

  // </script>