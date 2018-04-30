const readlineSync = require("readline-sync");
const moment = require("moment");

// Your program should ask the user for a stop code,...
//  and print a list of the next five buses at that stop code, with their routes, destinations, and the
// time until they arrive in minutes.
const busStopCode = "490008660N";
// let stopCode = readlineSync.question("Please input a stop code: ");
// console.log("You have entered bus stop code: " + stopCode);

var request = require("request");

let sortedBusArrivals = [];

request(
  "https://api.tfl.gov.uk/StopPoint/" +
    busStopCode +
    "/Arrivals?app_id=e6d22ef6&app_key=d52e914b030019b478891bd9a6a964f6",
  function(error, response, body) {
    const listOfBusArrivals = JSON.parse(body);
    const sortedBusArrivals = getBusArrivalsByClosest(listOfBusArrivals);
    // printNextFiveBuses(sortedBusArrivals);
    sortedBusArrivals.forEach(busArrival => {
      const lineId = busArrival["lineId"];

      request(
        "https://api.tfl.gov.uk/Line/" + lineId + "/StopPoints",
        function(error, response, body) {
          const listOfStopPoints = JSON.parse(body);
          listOfStopPoints.forEach(stopPoint => {
            console.log(stopPoint["commonName"]);
          });
        }

        //   printNextFiveBuses();
      );
    });
  }
);

function printNextFiveBuses(listOfBusArrivals) {
  console.log("***************************************************** \n");
  for (i = 0; i < Math.min(listOfBusArrivals.length, 5); i++) {
    const busArrival = listOfBusArrivals[i];
    console.log(i + 1);
    console.log("_______________________________________________________________________\n");
    console.log(
      busArrival["lineName"] +
        " towards " +
        busArrival["destinationName"] +
        ". Arriving in " +
        (busArrival["timeToStation"] / 60).toFixed(0) +
        " minutes.\n\n"
    );
  }
}

function getBusArrivalsByClosest(listOfBusArrivals) {
  listOfBusArrivals.sort(function(a, b) {
    return moment(b.expectedArrival).isBefore(a.expectedArrival);
  });
  return listOfBusArrivals;
}

const busLine = 217;
