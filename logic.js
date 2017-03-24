
var config = {
    apiKey: "AIzaSyBw6KqKR6_y6mS5gSoADvwUelEVWXFHjmo",
    authDomain: "howyoudoing-f3f3f.firebaseapp.com",
    databaseURL: "https://howyoudoing-f3f3f.firebaseio.com",
    storageBucket: "howyoudoing-f3f3f.appspot.com",
    messagingSenderId: "737070940637"
}

firebase.initializeApp(config);

var database = firebase.database();

var data = "";
var username;
var scoreHappy;
var count;
var today = moment();
var signedIn = false;

window.onload = function() {

	if (signedIn === true) {

	}

	if (signedIn === false) {
		
	}

  	$("#signUp").on("click", function(event) {

    	function go() {
      		username = $("#username").val();
      		checkIfUserExists(username);
    	}

    	go();

    	function userExistsCallback(username, exists) {

      		if (exists) {
        		var htmlExists = ("<p>Username " + username + " already exists. Please choose another username.</p>");
        		document.querySelector("#exists").innerHTML = htmlExists;
        		console.log("user " + username + " exists!");
      		} else {
        		var htmlDoesntExist = "<p>You are signed up!</p>";
        		document.querySelector("#exists").innerHTML = htmlDoesntExist;
        		console.log("user " + username + " does not exist!");
        		signedIn = true;
      		}	
    	}
   
    	function checkIfUserExists(username) {

      		database.ref('users/' + username).once('value', function(snapshot) {
        		var exists = (snapshot.val() !== null);
        		userExistsCallback(username, exists);
      		});
    	}
  	});


  	$("#signIn").on("click", function(event) {
    	username = $("#username").val();
    	signedIn = true;
  	})

}

(function() {

	var width = 320;
	var height = 0;
	var streaming = false;
	var video = null;
	var canvas = null;
	var photo = null;
	var startbutton = null;

	function startup() {
	    video = document.getElementById('video');
	    canvas = document.getElementById('canvas');
	    photo = document.getElementById('photo');
	    startbutton = document.getElementById('startbutton');

	    navigator.getMedia = ( navigator.getUserMedia ||
	                           navigator.webkitGetUserMedia ||
	                           navigator.mozGetUserMedia ||
	                           navigator.msGetUserMedia);

	    navigator.getMedia(
	    {
	        video: true,
	        audio: false
	    },
	    function(stream) {
	        if (navigator.mediaDevices.getUserMedia) {
	          video.mozSrcObject = stream;
	        } else {
	          var vendorURL = window.URL || window.webkitURL;
	          video.src = vendorURL.createObjectURL(stream);
	    }
	        video.play();
	    },
	    function(err) {
	        	console.log("An error occured! " + err);
	    }
	);

	video.addEventListener('canplay', function(ev){
	    if (!streaming) {
	        height = video.videoHeight / (video.videoWidth/width);

	        if (isNaN(height)) {
	          	height = width / (4/3);
	        }
	      
	        video.setAttribute('width', width);
	        video.setAttribute('height', height);
	        canvas.setAttribute('width', width);
	        canvas.setAttribute('height', height);
	        streaming = true;

	      	}

	    }, false);

	    startbutton.addEventListener('click', function(ev){
	      	takepicture();
	      	ev.preventDefault();
	    }, false);
	    
	    clearphoto();
	}

	function clearphoto() {
	    var context = canvas.getContext('2d');
	    context.fillStyle = "#AAA";
	    context.fillRect(0, 0, canvas.width, canvas.height);

	    data = canvas.toDataURL('image/png');
	    photo.setAttribute('src', data);
	}
	  
	function takepicture() {
	    var context = canvas.getContext('2d');
	    if (width && height) {
	      	canvas.width = width;
	      	canvas.height = height;
	      	context.drawImage(video, 0, 0, width, height);
	    
	      	data = canvas.toDataURL('image/png');
	      	photo.setAttribute('src', data);

	      	database.ref('users/' + username + '/' + today).push({
	        	data: data,
	        	dateAdded: firebase.database.ServerValue.TIMESTAMP
	      	});

	      	database.ref('users/' + username + '/' + today).on("child_added", function(childSnapshot) {

	        	console.log("IMAGE NAME FROM FIREBASE: " + childSnapshot.val().data);
	        	console.log("DATE ADDED FROM FIREBASE: " + childSnapshot.val().dateAdded);

	    	}, function(errorObject) {
	        	console.log("The read failed: " + errorObject.code);
	    	});
	    } else {
	      	clearphoto();
	    }
	}

	window.addEventListener('load', startup, false);

})();

function getEmotion() {

	  	var input = {
	    	"image": data,
	    	"numResults": 7
	  	};

		Algorithmia.client("simeYEZ7zXEZjGi27B+AwrRVLjo1")
	             	.algo("algo://deeplearning/EmotionRecognitionCNNMBP/0.1.2")
	             	.pipe(input)
	             	.then(function(output) {
	              		console.log(output);
	              		console.log(output.result.results);

	              		for(var i = 0; i < output.result.results.length; i++) {
	                		var emotions = output.result.results[i][1];
	                		console.log(emotions);

	                		if(emotions === "Happy") {
	                  			scoreHappy = output.result.results[i][0];
	                  			scoreHappy = scoreHappy.toPrecision(2);
	                  			console.log(scoreHappy);

	                  			database.ref().child('users/' + username + '/' + today).push({
	                    			score: scoreHappy,
	                    			dateAdded: firebase.database.ServerValue.TIMESTAMP
	                  			});
	                 		}
	              		}
	  	});
