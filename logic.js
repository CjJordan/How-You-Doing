  var config = {
      apiKey: "AIzaSyBEUb3kOqlJ-mQYLmI2BJzbcC8kh5XZW8M",
      authDomain: "test-8e941.firebaseapp.com",
      databaseURL: "https://test-8e941.firebaseio.com",
      storageBucket: "test-8e941.appspot.com",
      messagingSenderId: "843864176794"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  var database = firebase.database();

  var data = "";
  var username;
  var scoreHappy;
  var today = moment();
  var signIn = false;
  var textScore;
  var newPhoto = false;



  (function() {

      var width = 320;
      var height = 0;
      var streaming = false;
      var video = null;
      var canvas = null;
      var startbutton = null;

      function startup() {
          video = document.getElementById('video');
          canvas = document.getElementById('canvas');
          startbutton = document.getElementById('startbutton');

          navigator.getMedia = (navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia);

          navigator.getMedia({
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

          video.addEventListener('canplay', function(ev) {
              if (!streaming) {
                  height = video.videoHeight / (video.videoWidth / width);

                  if (isNaN(height)) {
                      height = width / (4 / 3);
                  }

                  video.setAttribute('width', width);
                  video.setAttribute('height', height);
                  canvas.setAttribute('width', width);
                  canvas.setAttribute('height', height);
                  streaming = true;

              }

          }, false);

          startbutton.addEventListener('click', function(ev) {
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
      }

      function takepicture() {
          var context = canvas.getContext('2d');
          if (width && height) {
              canvas.width = width;
              canvas.height = height;
              context.drawImage(video, 0, 0, width, height);

              data = canvas.toDataURL('image/png');
              getEmotion();
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

              for (var i = 0; i < output.result.results.length; i++) {
                  var emotions = output.result.results[i][1];
                  console.log(emotions);

                  if (emotions === "Happy") {
                      scoreHappy = output.result.results[i][0];
                      scoreHappy = scoreHappy.toPrecision(2);
                      scoreHappy = scoreHappy.toString().replace(/^[0.]+/, "");
                      scoreHappy = parseInt(scoreHappy).toPrecision(2) / 100;
                      scoreHappy = 1 - scoreHappy;
                      console.log("scoreHappy", scoreHappy);


                  }
              }

              combineScores();
          });
  }


  function SetOffCanvasHeight() {
      var height = $(window).height();
      var contentHeight = $(".off-canvas-content").height();
      if (contentHeight > height) { height = contentHeight; }

      $(".off-canvas-wrapper").height(height);
      $("#offCanvasBottom1").height(height);
      $(".off-canvas").height(height);
  }

  // jQuery for page scrolling feature - requires jQuery Easing plugin
  $('.page-scroll a').bind('click', function(event) {
      var $anchor = $(this);
      $('html, body').stop().animate({
          scrollTop: ($($anchor.attr('href')).offset().top - 50)
      }, 1250, 'easeInOutExpo');
      event.preventDefault();
  });



  $(document).ready(function() {
      SetOffCanvasHeight();

      var count = 0;

      database.ref('users/' + username).on("child_added", function(childSnapshot) {
          count++;
          var color = childSnapshot.val().color;
          var url = childSnapshot.val().data;

          if (!newPhoto) {
              console.log("count", count);

              console.log("IMAGE NAME FROM FIREBASE: " + childSnapshot.val().data);
              console.log("COLOR ADDED FROM FIREBASE: " + childSnapshot.val().color);
              $("#boxesHere").append('<li style="background:linear-gradient(' + color + ',' + color + ' ),url(' + url + ')no-repeat left center; background-size: cover;">&nbsp;</li>');
          } else {
              console.log("count is", count);
              $("#boxesHere li:nth-child(" + count + ")").before('<li style="background:linear-gradient(' + color + ',' + color + ' ),url(' + url + ')no-repeat left center; background-size: cover;">&nbsp;</li>');
              console.log("newPhoto");
          }

      }, function(errorObject) {
          console.log("The read failed: " + errorObject.code);
      });

      // database.off();

      $(window).resize(function() {
          SetOffCanvasHeight();
      });

      setTimeout(function() {
          for (var i = count; i < 366; i++) {
              var space = "";

              $("#boxesHere").append('<li>' + space + i + '</li>');

          }
          console.log("count", count);
      }, 15000);

      console.log("cat");

      // creates click event when button for adding sentiment text is used
      $("#getYourTextColor").on("click", function(event) {
          event.preventDefault();
          console.log("dog");
          // Grabs user input text from the html
          var textInput = $("#inputText").val().trim();
          $("#inputText").empty();

          console.log(textInput);
          //Verifies that user actually input text - if not, sends user an alert
          if (textInput.length === 0) {
              alert("You must input text to find out how you're really doin' today.");
              return false;
          }
          ////Verifies that user only uses certain regular expression characters - if not, sends user an alert
          if (/[^!',\.\-\?a-zA-Z0-9' ']/.test(textInput)) {
              alert("Your input can only contain alphanumeric characters, and ! ' , . - ? ");
              return false;
          }
          //queries the API url with the user's input text - returns a positive, negative or neutral score based on user input
          var queryURL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2?text=" + textInput + "&apikey=4f46adf1-10d7-4023-ba43-7bd79cec1e59";
          $.ajax({
              url: queryURL,
              method: "GET"
          }).done(function(response) {

              textScore = (response.sentiment_analysis[0].aggregate.score);
              console.log(textScore);

              var sentimentString = (response.sentiment_analysis[0].aggregate.sentiment);
              console.log(sentimentString);
              //takes the different pos, neg, and neu scores given for the sentimentString and rounds the score to two decimal points
              if (sentimentString === "positive") {
                  textScore = textScore.toPrecision(2);
                  console.log(textScore);
              } else if (sentimentString === "negative") {
                  textScore *= -1;
                  textScore = 1 - textScore;
                  textScore = textScore.toPrecision(2);
                  console.log(textScore);
              } else if (sentimentString === "neutral") {
                  textScore = .5
                  console.log(textScore);
              }
          })
      })
  });


  function combineScores() {
      console.log("we're here");
      if (textScore && scoreHappy) {
          textScore = parseFloat(textScore);
          scoreHappy = parseFloat(scoreHappy);
          var moodColor;
          console.log("scoreHappy", scoreHappy);
          console.log("textScore", textScore);
          //  takes textScore and uses it to create sentiment color ( 1 is happy and  0 is sad ) and posts it in correct box
          if (((textScore + scoreHappy) / 2) <= 1.0 && ((textScore + scoreHappy) / 2) >= .90) {
              moodColor = "rgba(255,165,0,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .90 && ((textScore + scoreHappy) / 2) >= .80) {
              moodColor = "rgba(255,255,0,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .80 && ((textScore + scoreHappy) / 2) >= .70) {
              moodColor = "rgba(98,250,68,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .70 && ((textScore + scoreHappy) / 2) >= .60) {
              moodColor = "rgba(144,238,144,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .60 && ((textScore + scoreHappy) / 2) >= .50) {
              moodColor = "rgba(173,216,230,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .50 && ((textScore + scoreHappy) / 2) >= .40) {
              moodColor = "rgba(19,180,255,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .40 && ((textScore + scoreHappy) / 2) >= .30) {
              moodColor = "rgba(171,63,221,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .30 && ((textScore + scoreHappy) / 2) >= .20) {
              moodColor = "rgba(250,128,114,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .20 && ((textScore + scoreHappy) / 2) >= .10) {
              moodColor = "rgba(250,64,188,0.45)";
          } else if (((textScore + scoreHappy) / 2) < .10 && ((textScore + scoreHappy) / 2) >= .00) {
              moodColor = "rgba(229,7,31,0.45)";
          };

          newPhoto = true;
          console.log(moodColor);
          database.ref('users/' + username).push({
              color: moodColor,
              dateAdded: firebase.database.ServerValue.TIMESTAMP,
              data: data
          });
      } else {
          setTimeout(combineScores, 3000);
      }
  }