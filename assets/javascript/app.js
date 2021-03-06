  var config = {
      apiKey: "AIzaSyC8YjhOjSNXg1UGcE4ewZvbPQsXPlLqZKI",
      authDomain: "train-schedule-1f327.firebaseapp.com",
      databaseURL: "https://train-schedule-1f327.firebaseio.com",
      storageBucket: "train-schedule-1f327.appspot.com",
      messagingSenderId: "637792518738"
    };
    
    firebase.initializeApp(config);

    var dataRef = firebase.database();

    // Initial Values
    var name = "";
    var destination = "";
    var time = 0;
    var frequency = 0;

    var createHeaders = true;

    // Capture Button Click
    $("#add-train").on("click", function(event) {
      event.preventDefault();

      // Don't forget to provide initial data to your Firebase database.
      name = $("#name-input").val().trim();
      destination = $("#destination-input").val().trim();
      frequency = $("#frequency-input").val().trim();
      time = $("#time-input").val().trim();
      frequency = parseInt(frequency);

      // Code for the push
      dataRef.ref().push({

        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });
    });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    dataRef.ref().on("child_added", function(childSnapshot) {

      if(frequency !== 0){

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().frequency);
      console.log(childSnapshot.val().time);

      // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(time, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
   console.log("--------------------------------");
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
   console.log("--------------------------------");
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
   console.log("--------------------------------");
    // Minute Until Train
    var tMinutesTillTrain = frequency - tRemainder;
     tMinutesTillTrain = moment(tMinutesTillTrain).format("hh:mm");
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
   console.log("--------------------------------");
    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    nextTrain = moment(nextTrain).format("hh:mm");
    console.log("ARRIVAL TIME: " + nextTrain);

   console.log("--------------------------------");

      if(createHeaders){
        $("#train-list").append("<div class='row well'><div class='col-xs-2' id='name'>Name" +
        " </div><div class='col-xs-2' id='destination'>Destination"+ 
        " </div><div class='col-xs-2' id='frequency'> Frequency" + 
        " </div><div class='col-xs-2' id='nextTrain'> Next Train" + 
        " </div><div class='col-xs-2' id='tillTrain'> Minutes Till Train </div></div>");
        createHeaders = false;
      }

      // full list of items to the well
      $("#train-list").append("<div class='row well'><div class='col-xs-2' id='name'> " + childSnapshot.val().name +
        " </div><div class='col-xs-2' id='destination'> " + childSnapshot.val().destination +
        " </div><div class='col-xs-2' id='frequency'> " + childSnapshot.val().frequency +
        " </div><div class='col-xs-2' id='nextTrain'> " + nextTrain + 
        " </div><div class='col-xs-2' id='tillTrain'> " + tMinutesTillTrain + " </div></div>");

   }

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
