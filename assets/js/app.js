$(document).ready(function(){

 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyBEXfeJq1vlR5GDbQ_-Mx7wtv26_vB_b1w",
    authDomain: "train-time-6f756.firebaseapp.com",
    databaseURL: "https://train-time-6f756.firebaseio.com",
    projectId: "train-time-6f756",
    storageBucket: "train-time-6f756.appspot.com",
    messagingSenderId: "116498036874",
    appId: "1:116498036874:web:981993ee19af95a6"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)

  //Get a reference to the database service
  var database = firebase.database();

  // GLOBAL VARIABLES

  var trainName;
  var trainDestination;
  var trainFrequency;
  var firstTrain;
  var trainNextArrival;
  var trainMinutesAway;

// Populate Firebase Database with initial data
// Create an On Click event to capture form values and add trains to the database

$("#add-train").on("click", function(event) {

    // Prevent form from re-loading
    event.preventDefault(event)

    // Capture Input from form fields

    trainName = $("#trainNameInput").val().trim();
    trainDestination = $("#trainDestinationInput").val().trim();
    trainFrequency = $("#trainFrequencyInput").val().trim();
    firstTrain = $("#trainTimeInput").val().trim();

    // Log everything to the console

    console.log(trainName);
    console.log(trainDestination);
    console.log(trainFrequency);
    console.log(firstTrain);

    // Uploads train data to the database
    database.ref().push({

        dbTrainName: trainName,
        dbTrainDestination: trainDestination,
        dbTrainFrequency: trainFrequency,
        dbFirstTrain: firstTrain

    })

    // Alert "Train Successfully Added"
    alert("Train Successfully Added")

    // Clears all of the text-boxes
    $("#trainNameInput").text("")
    $("#trainDestinationInput").text("")
    $("#trainFrequencyInput").text("")
    $("#trainTimeInput").text("")


});

// Create Firebase event to retrieve trains from the darabase and add a table row in the html whern a user adds an entry

    database.ref().on("child_added", function(dataFromDatabase) {

        //console log data to maks sure it is receiving results
        console.log(dataFromDatabase.val())

        // Store everything into a variable

        var tName = dataFromDatabase.val().dbTrainName;
        var tDestination = dataFromDatabase.val().dbTrainDestination;
        var tFrequency = dataFromDatabase.val().dbTrainFrequency;
        var tFirstTrain = dataFromDatabase.val().dbFirstTrain;

        // ***********************************************
        // Next Arrival and Minutes Away Calculations Here

        var firstTimeConverted = moment(tFirstTrain, "HH:mm").subtract(1, "years");
        console.log("First Time Converted: " + firstTimeConverted);

        var currentTime = moment();
        console.log("Current Time: " + moment(currentTime).format("HH:mm"));

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in Time: " + diffTime);

        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        var tMinutesAway = tFrequency - tRemainder;
        console.log("Minutes Until Train: " + tMinutesAway);

        var tNextArrival = moment().add(tMinutesAway, "minutes");
        console.log("ARRIVAL TIME: " + moment(tNextArrival).format("HH:mm"));

        // ***********************************************

        // Display results inside the table

        var tr = $("<tr>");
        var tdName = $("<td>").text(tName)
        var tdDestination = $("<td>").text(tDestination)
        var tdFrequency = $("<td>").text(tFrequency)
        var tdFirstTrain = $("<td>").text(tFirstTrain)
        var tdNextArrival = $("<td>").text(tNextArrival)
        var tdMinutesAway = $("<td>").text(tMinutesAway)

        // create vars to hold table elements and content

        tr.append(tdName, tdDestination, tdFrequency, tdNextArrival, tdMinutesAway, tdFirstTrain)

        $("tbody").append(tr)

    });

});