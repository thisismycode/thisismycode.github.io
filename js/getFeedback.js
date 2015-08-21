/*
This is the JS for handling the reading of the feedback
It'll need to communicate to the PHP/DB host


*/


//run the following code whenever a new pseudo-page is created
//$(document).delegate('[data-role="page"]', 'pagecreate', function () {
	$(document).delegate('[id="readFeedback"]', 'pagecreate', function () {
	console.log("Called the function");
    //cache this page for later use (inside the AJAX function)
    var $this = $(this);

    //make an AJAX call to your PHP script
    $.getJSON('getFeedback.php?read=1', function (response) {

        //create a variable to hold the parsed output from the server
        var output = [];

        //if the PHP script returned a success
        if (response.status == 'success') {

            output.push('<li>' + "Rating" + "  -  " + " Feedback " + "  -  " + "  Name  " + '</li>');
            for (var key in response.items) { //iterate through the response rows

                 //add each response row to the output variable
                 //output.push('<li>' + response.items[key] + '</li>');
                 console.log("Key is " + key + " : " + response.items[key]);
                 var temp = "";
                 temp = temp + response.items[key];
                 theSplit = temp.split(",");
                 /* the string looks like this

                 6,John Wilson,Peter French says what?,john@aol.com,poor,12345678,3215,123.3.51.222,2015-08-15 16:12:11,0

                 */
                 var theName = theSplit[1];
                 var tempFeedback = theSplit[2];
                 var theFeedback = tempFeedback.replace(/&Dagger;/g, ","); // put the commas back in
                 var theRating = theSplit[4];
                 if (theRating == 'vpoor'){
                 	theRating = "Very Poor";
                 }
                 if (theRating == 'poor') theRating = "Poor";
                 if (theRating == 'average') theRating = "Average";
                 if (theRating == 'good') theRating = "Good";
                 if (theRating == 'vgood') theRating = "Very Good";
                 output.push('<li>' + theRating + " - " + theFeedback + " - " + theName + '</li>');
            }

        //if the PHP script returned an error
        } else { //output an error message
            output.push('<li>No Data Found</li>');
        }

        //append the output to the `data-role="content"` div on this page as a listview and trigger the `create` event on its parent to style the listview
        //$this.children('[data-role="content"]').append('<ul data-role="listview">' + output.join('') + '</ul>').trigger('create');
        $this.children('[data-role="main"]').append('<ul data-role="listview">' + output.join('') + '</ul>').trigger('create');
    	});
	});

$(document).delegate('[id="unreadFeedback"]', 'pagecreate', function () {
	console.log("Called the function");
    //cache this page for later use (inside the AJAX function)
    var $this = $(this);

    //make an AJAX call to your PHP script
    $.getJSON('getFeedback.php', function (response) {

        //create a variable to hold the parsed output from the server
        var output = [];

        //if the PHP script returned a success
        if (response.status == 'success') {

            //iterate through the response rows
            
            for (var key in response.items) {

                 //add each response row to the output variable
                 output.push('<li>' + response.items[key] + '</li>');
            }

        //if the PHP script returned an error
        } else {

            //output an error message
            output.push('<li>No Data Found</li>');
        }

        //append the output to the `data-role="content"` div on this page as a listview and trigger the `create` event on its parent to style the listview
        //$this.children('[data-role="content"]').append('<ul data-role="listview">' + output.join('') + '</ul>').trigger('create');
        $this.children('[data-role="main"]').append('<ul data-role="listview">' + output.join('') + '</ul>').trigger('create');
    	});
	});
