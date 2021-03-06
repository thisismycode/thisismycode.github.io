/*
This is the JS for handling the reading of the feedback
It'll need to communicate to the PHP/DB host
John Wilson - 213160526 SIT313 Assignment 1 - August 2015

*/

//run the following code whenever the readFeedback pseudo-page is created
// it'll query my server and get the feedback in DESC date order
$(document).delegate('[id="readFeedback"]', 'pagecreate', function () {
	console.log("Called the function");
    //cache this page for later use (inside the AJAX function)
    var $this = $(this);

    //make an AJAX call to the PHP script
    $.getJSON('http://emeraldnetworksolutions.com.au/sit313/getFeedback.php', function (response) {

        //create a variable to hold the parsed output from the server

        var theOutputString = '';

        //if the PHP script returned a success
        if (response.status == 'success') {

            //output.push('<li>' + "Rating" + "  -  " + " Feedback " + "  -  " + "  Name  " + '</li>');
            for (var key in response.items) { //iterate through the response rows

                 //console.log("Key is " + key + " : " + response.items[key]); // debugging
                 var temp = "";
                 temp = temp + response.items[key];
                 theSplit = temp.split(",");
                 /* the string looks like this

                 6,John Wilson,The food was good,john@aol.com,poor,12345678,3215,123.3.51.222,2015-08-15 16:12:11,0

                 */
                 var theName = theSplit[1];
                 var tempFeedback = theSplit[2];
                 var theFeedback = tempFeedback.replace(/&Dagger;/g, ","); // put the commas back in
                 var theRating = theSplit[4];
                 var theDate = theSplit[8];
                 var theIP = theSplit[7];
                 var theEmail = theSplit[3];
                 if (theName == '') theName = 'Anonymous'; // if the name is blank
                 if (theRating == 'vpoor'){
                 	theRating = "&#9734; &#9734; &#9734; &#9734;"; // zero stars
                 }
                 // replace ratings with stars
                 if (theRating == 'poor') theRating = "&#9734; &#9734; &#9734; &#9733;"; // one star
                 if (theRating == 'average') theRating = "&#9734; &#9734; &#9733; &#9733;"; // two stars
                 if (theRating == 'good') theRating = "&#9734; &#9733; &#9733; &#9733;"; // three stars
                 if (theRating == 'vgood') theRating = "&#9733; &#9733; &#9733; &#9733;"; // four stars, well done 
                 theOutputString += '<div data-role="collapsible"><h2><span id="ratingSpan">' + theRating + '</span> : ' + theFeedback + '</h2>';
                 theOutputString +="<li>Left by : <strong>" + theName + '</strong></li><li>Email address: <strong>' + theEmail + '</strong></li>';
                 theOutputString += '<li>Left on : <strong>' + theDate + '</strong></li><li>From IP address : <strong>' + theIP + '</strong></li>';
                 theOutputString += '</div>'; 

             }

        //if the PHP script returned an error
        } else { //output an error message
        	theOutputString = '<p id="feedBackError">There was no feedback to be found. I mean we looked everywhere man,';
        	theOutputString +=' under the rug, down behind the sofa, we even checked in the bin.';
        	theOutputString +=' Is it possible that no-one cares enough or has something gone wrong?</p>';
        }

        //append the output to the `data-role="main"` div on this page and trigger the `create` event on its parent to style the content

        $this.children('[data-role="main"]').append(theOutputString).trigger('create');

    });
});
