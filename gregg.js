var Twit = require('twit');

var config = require('./config.js');

// Making a Twit object for connection to the API
var T = new Twit(config);

// An empty array for a queue of tweets
var queue = [];

var reactions = ['I feel threatened', 'I saw something, I said something', 'Do something!'];

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

  //retweet random tweet
  // T.post('statuses/retweet', { status: at + '' + reactions[react], id:tweetID}, reactionSwitch);

	//here's where I try and create the reply
  var at = "@imd244";
  var react = Math.floor(Math.random() * reactions.length);

  //I'm trying to use this as a way to reply to the retweet and send it to @mta
  T.post('statuses/retweet', {id:tweetID}, retweeted);
  T.post('statuses/update', { status: at + ' ' + reactions[react], in_reply_to_status_id:tweetID}, reactionSwitch);

  function reactionSwitch(err) {
    if (err){ 
      console.log( "You messed up");
    } 
    else {
      console.log("You reacted with" + ' ' + reactions[react]);
    }
  }

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

