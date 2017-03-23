var config = {
    apiKey: "AIzaSyBw6KqKR6_y6mS5gSoADvwUelEVWXFHjmo",
    authDomain: "howyoudoing-f3f3f.firebaseapp.com",
    databaseURL: "https://howyoudoing-f3f3f.firebaseio.com",
    storageBucket: "howyoudoing-f3f3f.appspot.com",
    messagingSenderId: "737070940637"
  };

  firebase.initializeApp(config);

  var database = firebase.database();

  var data = "";
  var username = "";
  var scoreHappy;
  var scoreSad;


(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 600;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

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
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
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

  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    data = canvas.toDataURL('image/png');
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      data = canvas.toDataURL('image/png');
      getEmotion();

      database.ref('users/' + username).push({
        data: data,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

      database.ref().on("child_added", function(childSnapshot) {

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




$("#signUp").on("click", function(event) {

  username = $("#username").val();

    database.ref('users').once('value', function(snapshot) {
      if (snapshot.hasChild(username)) {
        console.log("Username already exists. Please choose another username.");
      }
      else {
        database.ref('users/' + username).push({
          username: username
        });
     }
    });

//database.ref().startAt(null, username).endAt(null, username).on("value", function(snapshot) {

//          if (snapshot.val() === null) {
//            console.log("Username not taken.");
//         } else {
//            console.log("Username taken.");
//         }  

//  });
});


$("#signIn").on("click", function(event) {

  username = $("username").val();

})

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

               var camScore;

               for(var i = 0; i < output.result.results.length; i++) {
                 var emotions = output.result.results[i][1];
                 console.log(emotions);

                 if(emotions === "Happy") {
                  scoreHappy = output.result.results[i][0];
                  scoreHappy = scoreHappy.toPrecision(2);               
                  camScore = scoreHappy;
                  var score = camScore;
                    score = score.toString().replace(/^[0.]+/, "");
                    score = parseInt(score).toPrecision(2)/100;
                  console.log("camScore", score);
                 }

                }

             });

}