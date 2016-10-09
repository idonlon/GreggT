var Twit = require('twit');

var config = require('./config.js');

// Making a Twit object for connection to the API
var T = new Twit(config);

// An empty array for a queue of tweets
var queue = [];

// Every so often pick a random one from the queue and tweet it once per hour
setInterval(tweetIt, 20 * 1000);

var phrase = 'threat,danger';
//var regex = /threat/;

var stream = T.stream('statuses/filter', { track: phrase });
stream.on('tweet', gotTweet);

//This function searches relevant tweets and retweets them
function tweetIt() {
	console.log('I have ' + queue.length + ' tweets in the queue.');

  // Make sure there is something
  if (queue.length > 0) {
  	//Store tweets as they are created and choose one randomly every hour
  	var index = Math.floor(Math.random() * queue.length);
    //the ID of that random tweet is the one that is randomly pulled from the queue
    var tweetID = queue[index];
    console.log('attempting to retweet: ' + tweetID);
    // Start over again?
    queue = [];

    T.post('statuses/retweet', { id: tweetID }, retweeted);
    T.post('statuses/update', {status: '@imd244', in_reply_to_status_id: tweetID});

    // also tweet something
    

    function retweeted(err, data, response) {
    	if (err) {
    		console.log("Error: " + err.message);
    	} else {
    		console.log('Retweeted: ' + tweetID);
    	}
    }

} else {
	console.log('No tweets to retweet.');
}
}

function gotTweet(tweet) {
	console.log('Adding to queue ' + tweet.id_str);
    // Save this tweet for the queue
    queue.push(tweet.id_str);

}