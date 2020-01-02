$(document).ready(function () {

	//Firebase link

	var config = {
		apiKey: "AIzaSyC1zUvc5K6NJXFxwm74405gegKYfPSNT-4",
		authDomain: "train-schedule-db.firebaseapp.com",
		databaseURL: "https://train-schedule-db.firebaseio.com",
		projectId: "train-schedule-db",
		storageBucket: "train-schedule-db.appspot.com",
		messagingSenderId: "60174437847"
	};

	firebase.initializeApp(config);

	var database = firebase.database();

	//collect input from the submit button and store it in specific variables
	$(".submitInput").on("click", function (event) {


		var nameInput = $("#nameInput").val().trim();

		var numberInput = $("#numberInput").val().trim();

		var destinationInput = $("#destInput").val().trim();

		var timeInput = $("#timeInput").val().trim();

		var frequencyInput = $("#freqInput").val().trim();

		//input validation
		if (nameInput != "" &&
			numberInput != "" &&
			destinationInput != "" &&
			timeInput.length === 4 &&
			frequencyInput != "") {

			
			database.ref().push({
				name: nameInput,
				number: numberInput,
				destination: destinationInput,
				time: timeInput,
				frequency: frequencyInput,
			});

		} else {
			alert("Please enter valid train data");
			$("input").val("");
			return false;
		}



		$("input").val("");

	});

	database.ref().on("child_added", function (childSnapshot) {

		var name = childSnapshot.val().name;
		var number = childSnapshot.val().number;
		var destination = childSnapshot.val().destination;
		var time = childSnapshot.val().time;
		var frequency = childSnapshot.val().frequency;


		//time formatting
		var frequency = parseInt(frequency);
		var currentTime = moment();


		//HH:mm for time format
		var dateConvert = moment(childSnapshot.val().time, "HHmm").subtract(1, "years");


		var trainTime = moment(dateConvert).format("HHmm");


		//difference bw the times
		var timeConvert = moment(trainTime, "HHmm").subtract(1, "years");
		var timeDifference = moment().diff(moment(timeConvert), "minutes");


		//remainder
		var timeRemaining = timeDifference % frequency;


		//time until next train
		var timeAway = frequency - timeRemaining;

	

		//next train arrival
		var nextArrival = moment().add(timeAway, "minutes");


		var arrivalDisplay = moment(nextArrival).format("HHmm");

		//append data to table
		$("#boardText").append(
			"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
			"<td id='numberDisplay'>" + childSnapshot.val().number +
			"<td id='destinationDisplay'>" + childSnapshot.val().destination +
			"<td id='frequencyDisplay'>" + childSnapshot.val().frequency +
			"<td id='arrivalDisplay'>" + arrivalDisplay +
			"<td id='awayDisplay'>" + timeAway + " minutes until arrival" + "</td></tr>");
	});

	//reset 
	$(".resetInput").on("click", function (event) {
		location.reload();
	});

	//auto refresh per 1 minute 
	setInterval("window.location.reload()", 60000);
});