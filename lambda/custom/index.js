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
        //this.response.listen('What size and temperament are you looking for in a dog?');
        this.emit(':responseReady');
    },
    'DiscoveryIntent' : function () {
        //Call the pet match API
        this.response.speak('You have been in Mc Donalds.');
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
