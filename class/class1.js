$(document).ready(function(){

  var textInput = "My sister is mean."

  var queryURL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2?text="+textInput+"&apikey=4f46adf1-10d7-4023-ba43-7bd79cec1e59";

  $.ajax({
     url: queryURL,
     method: "GET"
   }).done(function(response) {
        
        var textScore = (response.sentiment_analysis[0].aggregate.score);
        console.log (textScore);
        
        var sentimentString = (response.sentiment_analysis[0].aggregate.sentiment);

       console.log (sentimentString);

     if (sentimentString === "positive"){
        textScore = textScore.toPrecision(2);
            console.log(textScore);
      }
      else if (sentimentString === "negative") {
          textScore *= -1;
          textScore = 1.00 - textScore;
          textScore = textScore.toPrecision(2);
            console.log(textScore);
      }

   if (textScore <= 1.0 && textScore > .90) {
    $("#post-color").text("").css("background", ("#FFA500 "))
  }
    else if (textScore <= .90 && textScore > .80) {
    $("#post-color").text("").css("background", ("#FFFF00 "))
  }
    else if (textScore <= .80 && textScore > .70) {
    $("#post-color").text("").css("background", ("#62FA44 "))
  }
    else if (textScore <= .70 && textScore > .60) {
    $("#post-color").text("").css("background", ("#90EE90 "))
  }
    else if (textScore <= .60 && textScore> .50) {
    $("#post-color").text("").css("background", ("#ADD8E6 "))
  }
    else if (textScore<= .50 && textScore> .40) {
    $("#post-color").text("").css("background", ("#13B4FF "))
  }
    else if (textScore<= .40 && textScore> .30) {
    $("#post-color").text("").css("background", ("#AB3FDD "))
  }
    else if (textScore<= .30 && textScore> .20) {
    $("#post-color").text("").css("background", ("#FA8072 "))
  }
    else if (textScore<= .20 && textScore> .10) {
    $("#post-color").text("").css("background", ("#FA40BC "))
  }
    else if (textScore<= .10 && textScore> .00) {
    $("#post-color").text("").css("background", ("#E5071F "))
  };
 })
});

