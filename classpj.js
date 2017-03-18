$(document).ready(function(){


<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>
  <script type="text/javascript>
    // The below code fills in the first row of the table
    var queryURL = "https://api.havenondemand.com/1/api/sync/analyzesentiment/v2?text=Happy&apikey=4f46adf1-10d7-4023-ba43-7bd79cec1e59";
    $.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
    	console.log (response);
        
        }







}); //end ready function