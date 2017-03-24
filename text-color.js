
  // Initialize Firebasevar 
  var config = {
    apiKey: "AIzaSyDHPiJgG-voGJuz9Worqr8kip9xLk3vQv0",
    authDomain: "how-you-doin-f7a82.firebaseapp.com",
    databaseURL: "https://how-you-doin-f7a82.firebaseio.com",
    storageBucket: "how-you-doin-f7a82.appspot.com",
    messagingSenderId: "214857848906"
  };
  
  
//</script>

firebase.initializeApp(config);
    var dataRef = firebase.database();

  
// creates click event when button for adding sentiment text is used
$("#textInputBtn").on("click", function(event) {
  event.preventDefault();
  console.log("dog");

// Grabs user input text from the html
  var textInput = $("#inputText").val().trim();
  console.log(textInput);

//Verifies that user actually input text - if not, sends user an alert
   if (textInput.length === 0) {    
   alert("You must input text to find out how you're really doin' today.");
   return false;
   console.log(textInput);
 }

  ////Verifies that user only uses certain regular expression characters - if not, sends user an alert
  if (/[^!',\.\-\?a-zA-Z0-9' ']/.test(textInput)) {
   alert("Your input can only contain alphanumeric characters, and ! ' , . - ? ");
   return false;
 }
    });
 //queries the API url with the user's input text - returns a positive, negative or neutral score based on user input

    var queryURL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2?text="+textInput+"&apikey=4f46adf1-10d7-4023-ba43-7bd79cec1e59";

   $.ajax({
     url: queryURL,
     method: "GET"
   }).done(function(response) {
        
        var textScore = (response.sentiment_analysis[0].aggregate.score);
        console.log (textScore);
        
        var sentimentString = (response.sentiment_analysis[0].aggregate.sentiment);

        console.log (sentimentString);

    //takes the different pos, neg, and neu scores given for the sentimentString and rounds the score to two decimal points

        if (sentimentString === "positive"){
         textScore = textScore.toPrecision(2);
             console.log(textScore);
       }
       else if (sentimentString === "negative") {
           textScore *= -1;
           textScore = 1 - textScore;
           textScore = textScore.toPrecision(2);
             console.log(textScore);
       }

      else if (sentimentString === "neutral") {
        textScore = .5
        console.log(textScore);
      }
        else if (sentimentString === "neutral") {
        textScore = .5
        console.log(textScore);
      }

    var moodColor;

  //  takes textScore and uses it to create sentiment color ( 1 is happy and  0 is sad ) and posts it in correct box
        if (textScore <= 1.0 && textScore >= .90) {
        $("#box1").text("").css("background", ("#FFA500"));
        moodColor = "#FFA500"
      }
        else if (textScore <= .89 && textScore >= .80) {
        $("#box1").text("").css("background", ("#FFFF00"));
        moodColor = "#FFFF00"
      }
        else if (textScore <= .79 && textScore >= .70) {
        $("#box1").text("").css("background", ("#62FA44"));
      }
        else if (textScore <= .69 && textScore >= .60) {
        $("#box1").text("").css("background", ("#90EE90"));
        moodColor = "#90EE90"
      }
        else if (textScore <= .59 && textScore >= .50) {
        $("#box1").text("").css("background", ("#ADD8E6"));
        moodColor = "#ADD8E6"
      }
        else if (textScore <= .49 && textScore >= .40) {
        $("#box1").text("").css("background", ("#13B4FF"));
        moodColor = "#13B4FF"
      }
        else if (textScore <= .39 && textScore >= .30) {
        $("#box1").text("").css("background", ("#13B4FF"));
        moodColor = "#13B4FF"
      }
        else if (textScore <= .29 && textScore >= .20) {
        $("#box1").text("").css("background", ("#FA8072"));
        moodColor = "#FA8072"
      }
        else if (textScore <= .19 && textScore >= .10) {
        $("#box1").text("").css("background", ("#FA40BC"));
        moodColor = "#FA40BC"
      }
        else if (textScore <= .09 && textScore >= .00) {
        $("#box1").text("").css("background", ("#E5071F"));
        moodColor = "#E5071F"
      };
 })
  
  


    // Button for adding colors
  $("#getYourTextColor").on("click", function(event){
    event.preventDefault()
    console.log("click")
    
      

    var newColor = {
      color: moodColor,
     dateAdded: firebase.database.ServerValue.TIMESTAMP
    }


    // pushing colorInfo to Firebase
    dataRef.ref().push(newColor);
    
  }
      
      
      });

    
    






