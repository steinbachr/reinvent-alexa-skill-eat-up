'use strict';
const Alexa = require("alexa-sdk");
const https = require('https');

// For detailed tutorial on how to make an Alexa skill,
// please visit us at http://alexa.design/build

var handlers = {
    'NewSession': function() {
        console.log("in NewSession");
        // when you have a new session,
        // this is where you'll
        // optionally initialize

        // after initializing, continue on
        routeToIntent.call(this);
    },
    'LaunchRequest': function () {
        console.log("in LaunchRequest");
        this.response.speak('Welcome to eat up. I can help you find a restaurant.');
        this.emit(':responseReady');
    },
    'DiscoveryIntent' : function () {
        //Call the eat up API
        // this.response.speak('You have been in Mc Donalds.');
        let eatUpDiscovery = buildEatUpOptions();
        console.log("eat up discovery", eatUpDiscovery);
        httpGet(eatUpDiscovery).then(
            response => {
                console.log("EATUP RESULTS: ", JSON.stringify(response));

                if( response.history.length > 0 ) {
                    let respList = '';
                    response.history.forEach( (historyItem, index) => {
                        respList += historyItem.name + ", ";
                    });

                    this.response.speak("You have been to:" + respList);
                } else {
                    this.response.speak("I'm sorry I could not find a restaurant");
                }

                console.log("response: ", response);

            }
        ).catch( error => {
            console.log(error);
            this.response.speak("I'm really sorry. I'm unable to access part of my memory. Please try again later.");
            // Part 3: Extra Credit 3: save all the slots and create an
            // utterance so the user can pick up where they left off
            // HINT 1: You can use saveValue to save the slot values.
            // HINT 2: You can automate the recovery the next time the user
            // invokes your skill, you can check if there was an error and skip
            // right to the look up.

        }).then(() => {
            // after we get a result, have Alexa speak.
                this.emit(':responseReady');
            }
        );
        this.emit(':responseReady');
    },
    'SessionEndedRequest' : function() {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent' : function() {
        this.response.speak("This is eat. I can help you find a place to eat today. " +
             "You can say, I want to find a restaurant.");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent' : function() {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled' : function() {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, tell eat up" +
            " I want to find a restaurant.'");
    }
};

exports.handler = function(event, context) {

    // Each time your lambda function is triggered from your skill,
    // the event's JSON will be logged. Check Cloud Watch to see the event.
    // You can copy the log from Cloud Watch and use it for testing.
    console.log("====================");
    console.log("REQUEST: " + JSON.stringify(event));
    console.log("====================");
    var alexa = Alexa.handler(event, context);

    alexa.registerHandlers(handlers);
    alexa.execute();
};

// The hostname for the for the eat up api.
const EAT_UP_API = {
    HOSTNAME: 'f60d5b2g43.execute-api.us-east-2.amazonaws.com',
    DISCOVERY: '/prod/restaurants'
}

function routeToIntent() {
    switch (this.event.request.type) {
        case 'IntentRequest':
            this.emit(this.event.request.intent.name);
            break;
        case 'LaunchRequest':
            this.emit('LaunchRequest');
            break;
        default:
            this.emit('LaunchRequest');
    }
}

function buildEatUpOptions() {
    let params = {};
    let port = 443;
    return buildHttpGetOptions(EAT_UP_API.HOSTNAME, EAT_UP_API.DISCOVERY, port, params)
}


// ***********************************
// ** Webservice Calls
// ***********************************

// make an http get request calls resolve upon completion and reject if there's an error.
// returns a promise -
function httpGet(options){
    return new Promise(function(resolve, reject) {
        let request = https.request(options, response => {
            response.setEncoding('utf8');
            let returnData = "";

            if (response.statusCode < 200 || response.statusCode >= 300) {
                // we must return in this case
                // otherwise reject runs on the next tick and we'll get an error
                // when res.on('end') tries to parse the JSON.
                return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
            }

            response.on('data', chunk => {
                returnData = returnData + chunk;
            });

            response.on('end', () => {
                // we have now received the raw return data in the returnData variable.
                // We can see it in the log output via:
                // console.log(JSON.stringify(returnData))
                // we may need to parse through it to extract the needed data

                let response = JSON.parse(returnData);
                // this will execute whatever the block of code that was passed to
                // httpGet and pass the JSON `response` to it.
                resolve(response);
            });

            response.on('error', error => {
                reject(error);
            });
        });
        request.end();
    });
}

// Creates the options object for an HTTPs GET Request
// Returns an object.
function buildHttpGetOptions(host, path, port, params) {
    let options = {
         hostname: host,
         path: path , //+ buildQueryString(params),
         port: port,
         method: 'GET'
    };
    return options;
}

// Given a list of parameters it builds the query string for a request.
// Returns URI encoded string of parameters.
function buildQueryString(params) {
    let paramList = '';
    params.forEach( (paramGroup, index) => {
        paramList += `${ index === 0 ? '?' : '&'}${encodeURIComponent(paramGroup[0])}=${encodeURIComponent(paramGroup[1])}`;
    });
    return paramList;

}