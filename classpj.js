$(document).ready(function(){



    var textInput = "If I had a pony, I get on it and ride away from here as fast as I could."

    var queryURL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2?text="+textInput+"&apikey=4f46adf1-10d7-4023-ba43-7bd79cec1e59";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
	    
	    var score = (response.sentiment_analysis[0].aggregate.score);
	    console.log (score);

	    console.log (response.sentiment_analysis[0].aggregate);

	    
	    var sentiment = (response.sentiment_analysis[0].aggregate.sentiment);

      console.log (response.sentiment_analysis[0].aggregate.sentiment);


});

});
        
		   







