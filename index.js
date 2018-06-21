'use strict';

/**
 * This sample demonstrates a smart home skill using the publicly available API on Amazon's Alexa platform.
 * For more information about developing smart home skills, see
 *  https://developer.amazon.com/alexa/smart-home
 *
 * For details on the smart home API, please visit
 *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference
 */

/**
 * Mock data for devices to be discovered
 *
 * For more information on the discovered appliance response please see
 *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#discoverappliancesresponse
 */
 
var correlationToken = "";

var AWS = require('aws-sdk'); 
var iotdata = new AWS.IotData({endpoint: 'aeh3dz89l6ydy.iot.us-east-1.amazonaws.com'});

function publishMessage(iotTopic, iotPayload){
    
	var iotParams = {
		topic: iotTopic, // required
		//payload: new Buffer('...') || payload,
		payload: JSON.stringify(iotPayload),
		qos: 1
	};
	
	iotdata.publish(iotParams, function(err, data) {
		if (err) 
		{
		    console.log("ERROR log here man");
		    console.log(err, err.stack);
		}// an error occurred
		else{console.log(data);}
		
	});
}

const USER_DEVICES = [
    {
        endpointId: "TV-Light",
        friendlyName: "TV Room Light",
        description: "Smart Light by Yin Zin Pang",
        manufacturerName: "Yin Zin Pang",
        displayCategories: ["LIGHT"],
        cookie: {
            "extraDetail1": "Yin Zin Pang Smart Light",
          },
        capabilities: [
            
            {
              type: "AlexaInterface",
              interface: "Alexa.EndpointHealth",
              version: "3",
              properties: {
                supported: [
                  {
                    name: "connectivity"
                  }
                ],
                proactivelyReported: true,
                retrievable: true
              }
            },
            {
              type: "AlexaInterface",
              interface: "Alexa",
              version: "3"
            },
            {
              type: "AlexaInterface",
              interface: "Alexa.PowerController",
              version: "3",
              properties: {
                supported: [
                  {
                    name: "powerState"
                  }
                ],
                proactivelyReported: true,
                retrievable: true
              }
            }
        ]
    },
];

/**
 * Utility functions
 */

function log(title, msg) {
    console.log(`[${title}] ${msg}`);
}

/**
 * Generate a unique message ID
 *
 * TODO: UUID v4 is recommended as a message ID in production.
 */
function generateMessageID() {
    return '38A28869-DD5E-48CE-BBE5-A4DB78CECB28'; // Dummy
}

/**
 * Generate a response message
 *
 * @param {string} name - Directive name
 * @param {Object} payload - Any special payload required for the response
 * @returns {Object} Response object
 */
function generateResponse(name, payload, stateValue) {
    
    return {
        context: {
            properties: [ 
                {
                  namespace: "Alexa.PowerController",
                  name: "powerState",
                  value: stateValue,
                  timeOfSample: "2018-02-02T16:20:50.52Z",
                  uncertaintyInMilliseconds: 200
                },
                {
                namespace: "Alexa.EndpointHealth",
                name: "connectivity",
                value: {
                    value: "OK"
                },
                timeOfSample: "2018-02-02T16:20:50.52Z",
                uncertaintyInMilliseconds: 200
            }
            ]
          },
        event: {
            header: {
              namespace: "Alexa",
              name: "Response",
              payloadVersion: "3",
              messageId: generateMessageID(),
              correlationToken: correlationToken
            },
            endpoint: {
              scope: {
                type: "BearerToken",
                token: "1"
              },
              endpointId: "TV-Light"
            },
            payload: payload
        }
    };
}

/**
 * Generate a report state response message
 *
 * @param {string} name - Directive name
 * @param {Object} payload - Any special payload required for the response
 * @returns {Object} Response object
 */
function generateReportStateResponse(name, payload) {
    
    return {
          context: {
            properties: [
            ]
          },
          event: {
            header: {
              messageId: generateMessageID(),
              correlationToken: correlationToken,
              namespace: "Alexa.PowerController",
              name: "Response",
              payloadVersion: "3"
            },
            endpoint: {
              scope: {
                type: "BearerToken",
                token: "1"
               },
               endpointId :  "TV-Light"
            },
            payload: {}
          }
    };
}

/**
 * Mock functions to access device cloud.
 *
 * TODO: Pass a user access token and call cloud APIs in production.
 */

function getDevicesFromPartnerCloud() {
    /**
     * For the purposes of this sample code, we will return:
     * (1) Non-dimmable light bulb
     * (2) Dimmable light bulb
     */
    return USER_DEVICES;
}

function isValidToken() {
    /**
     * Always returns true for sample code.
     * You should update this method to your own access token validation.
     */
    return true;
}

function isDeviceOnline(applianceId) {
    log('DEBUG', `isDeviceOnline (applianceId: ${applianceId})`);

    /**
     * Always returns true for sample code.
     * You should update this method to your own validation.
     */
    return true;
}

function turnOn(applianceId) {
    log('DEBUG', `turnOn (applianceId: ${applianceId})`);

    // Call device cloud's API to turn on the device
    publishMessage('rokkuchan@gmail.com/Lounge-Lamp', {applianceId: `${applianceId}`, command: 'TurnOn'});
    return generateResponse('TurnOnConfirmation', {}, "ON");
}

function turnOff(applianceId) {
    log('DEBUG', `turnOff (applianceId: ${applianceId})`);

    // Call device cloud's API to turn off the device
    publishMessage('rokkuchan@gmail.com/Lounge-Lamp', {applianceId: `${applianceId}`, command: 'TurnOff'});
    return generateResponse('TurnOffConfirmation', {}, "OFF");
}

function reportState(applianceId) {
    log('DEBUG', `reportState (applianceId: ${applianceId})`);

    return generateReportStateResponse('ReportState', {});
}

function setPercentage(applianceId, percentage) {
    log('DEBUG', `setPercentage (applianceId: ${applianceId}), percentage: ${percentage}`);

    // Call device cloud's API to set percentage

    return generateResponse('SetPercentageConfirmation', {});
}

function incrementPercentage(applianceId, delta) {
    log('DEBUG', `incrementPercentage (applianceId: ${applianceId}), delta: ${delta}`);

    // Call device cloud's API to set percentage delta

    return generateResponse('IncrementPercentageConfirmation', {});
}

function decrementPercentage(applianceId, delta) {
    log('DEBUG', `decrementPercentage (applianceId: ${applianceId}), delta: ${delta}`);

    // Call device cloud's API to set percentage delta

    return generateResponse('DecrementPercentageConfirmation', {});
}

/**
 * Main logic
 */

/**
 * This function is invoked when we receive a "Discovery" message from Alexa Smart Home Skill.
 * We are expected to respond back with a list of appliances that we have discovered for a given customer.
 *
 * @param {Object} request - The full request object from the Alexa smart home service. This represents a DiscoverAppliancesRequest.
 *     https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#discoverappliancesrequest
 *
 * @param {function} callback - The callback object on which to succeed or fail the response.
 *     https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html#nodejs-prog-model-handler-callback
 *     If successful, return <DiscoverAppliancesResponse>.
 *     https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#discoverappliancesresponse
 */
function handleDiscovery(request, callback) {
    log('DEBUG', `Discovery Request: ${JSON.stringify(request)}`);

    /**
     * Get the OAuth token from the request.
     * request.directive.header.namespace
     */
    const userAccessToken = request.directive.payload.scope.token.trim();

    /**
     * Generic stub for validating the token against your cloud service.
     * Replace isValidToken() function with your own validation.
     */
    if (!userAccessToken || !isValidToken(userAccessToken)) {
        const errorMessage = `Discovery Request [${request.directive.header.messageId}] failed. Invalid access token: ${userAccessToken}`;
        log('ERROR', errorMessage);
        callback(new Error(errorMessage));
    }

    /**
     * Assume access token is valid at this point.
     * Retrieve list of devices from cloud based on token.
     *
     * For more information on a discovery response see
     *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#discoverappliancesresponse
     */
    const response = {
        event:{
            header: {
                messageId: generateMessageID(),
                name: 'Discover.Response',
                namespace: 'Alexa.Discovery',
                payloadVersion: '3',
            },
            payload: {
                endpoints: getDevicesFromPartnerCloud(userAccessToken),
            },
        }
    };

    /**
     * Log the response. These messages will be stored in CloudWatch.
     */
    log('DEBUG', `Discovery Response: ${JSON.stringify(response)}`);

    /**
     * Return result with successful message.
     */
    callback(null, response);
}

/**
 * A function to handle control events.
 * This is called when Alexa requests an action such as turning off an appliance.
 *
 * @param {Object} request - The full request object from the Alexa smart home service.
 * @param {function} callback - The callback object on which to succeed or fail the response.
 */
function handleControl(request, callback) {
    log('DEBUG', `Control Request: ${JSON.stringify(request)}`);

    /**
     * Get the access token.
     */
    const userAccessToken = request.directive.endpoint.scope.token.trim();

    /**
     * Generic stub for validating the token against your cloud service.
     * Replace isValidToken() function with your own validation.
     *
     * If the token is invliad, return InvalidAccessTokenError
     *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#invalidaccesstokenerror
     */
    if (!userAccessToken || !isValidToken(userAccessToken)) {
        log('ERROR', `Discovery Request [${request.header.messageId}] failed. Invalid access token: ${userAccessToken}`);
        callback(null, generateResponse('InvalidAccessTokenError', {}));
        return;
    }

    /**
     * Grab the applianceId from the request.
     */
    const applianceId = request.directive.endpoint.endpointId;

    /**
     * If the applianceId is missing, return UnexpectedInformationReceivedError
     *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#unexpectedinformationreceivederror
     */
    if (!applianceId) {
        log('ERROR', 'No applianceId provided in request');
        const payload = { faultingParameter: `applianceId: ${applianceId}` };
        callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
        return;
    }

    /**
     * At this point the applianceId and accessToken are present in the request.
     *
     * Please review the full list of errors in the link below for different states that can be reported.
     * If these apply to your device/cloud infrastructure, please add the checks and respond with
     * accurate error messages. This will give the user the best experience and help diagnose issues with
     * their devices, accounts, and environment
     *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#error-messages
     */
    if (!isDeviceOnline(applianceId, userAccessToken)) {
        log('ERROR', `Device offline: ${applianceId}`);
        callback(null, generateResponse('TargetOfflineError', {}));
        return;
    }

    let response;

    switch (request.directive.header.name) {
        case 'TurnOn':
            response = turnOn(applianceId, userAccessToken);
            break;

        case 'TurnOff':
            response = turnOff(applianceId, userAccessToken);
            break;
        
        case 'ReportState':
            response = reportState(applianceId, userAccessToken);
            break;

        case 'SetPercentageRequest': {
            const percentage = request.directive.payload.percentageState.value;
            if (!percentage) {
                const payload = { faultingParameter: `percentageState: ${percentage}` };
                callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                return;
            }
            response = setPercentage(applianceId, userAccessToken, percentage);
            break;
        }

        case 'IncrementPercentageRequest': {
            const delta = request.directive.payload.deltaPercentage.value;
            if (!delta) {
                const payload = { faultingParameter: `deltaPercentage: ${delta}` };
                callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                return;
            }
            response = incrementPercentage(applianceId, userAccessToken, delta);
            break;
        }

        case 'DecrementPercentageRequest': {
            const delta = request.directive.payload.deltaPercentage.value;
            if (!delta) {
                const payload = { faultingParameter: `deltaPercentage: ${delta}` };
                callback(null, generateResponse('UnexpectedInformationReceivedError', payload));
                return;
            }
            response = decrementPercentage(applianceId, userAccessToken, delta);
            break;
        }

        default: {
            log('ERROR', `No supported directive name: ${request.header.name}`);
            callback(null, generateResponse('UnsupportedOperationError', {}));
            return;
        }
    }

    log('DEBUG', `Control Confirmation: ${JSON.stringify(response)}`);

    callback(null, response);
}

/**
 * Main entry point.
 * Incoming events from Alexa service through Smart Home API are all handled by this function.
 *
 * It is recommended to validate the request and response with Alexa Smart Home Skill API Validation package.
 *  https://github.com/alexa/alexa-smarthome-validation
 */
exports.handler = (request, context, callback) => {
    log("Handler Here");
    log(JSON.stringify(request));
    correlationToken = request.directive.header.correlationToken;
    switch (request.directive.header.namespace) {
        /**
         * The namespace of 'Alexa.ConnectedHome.Discovery' indicates a request is being made to the Lambda for
         * discovering all appliances associated with the customer's appliance cloud account.
         *
         * For more information on device discovery, please see
         *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#discovery-messages
         */
        case 'Alexa.Discovery':
            handleDiscovery(request, callback);
            break;

        /**
         * The namespace of "Alexa.ConnectedHome.Control" indicates a request is being made to control devices such as
         * a dimmable or non-dimmable bulb. The full list of Control events sent to your lambda are described below.
         *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#payload
         */
        case 'Alexa.PowerController':
            handleControl(request, callback);
            break;
            
        case 'Alexa':
            handleControl(request, callback);
            break;

        /**
         * The namespace of "Alexa.ConnectedHome.Query" indicates a request is being made to query devices about
         * information like temperature or lock state. The full list of Query events sent to your lambda are described below.
         *  https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/smart-home-skill-api-reference#payload
         *
         * TODO: In this sample, query handling is not implemented. Implement it to retrieve temperature or lock state.
         */

        /**
         * Received an unexpected message
         */
        default: {
            const errorMessage = `No supported namespace: ${request.directive.header.namespace}`;
            log('ERROR', errorMessage);
            callback(new Error(errorMessage));
        }
    }
};
