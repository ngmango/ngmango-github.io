const express = require('express');
const app = express();
const request = require('request');
const cheerio = require('cheerio');
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/trudeau', (req, res) => {
       
    request('https://twitter.com/JustinTrudeau', (error, resp, body) => {
        let site = [];        
        
        if(!error) {
            const $ = cheerio.load(body);
            let links = $('.js-tweet-text-container p');
            
            links.each(function (i, link) {
                site[i] = $(link).text();
            })
            //console.log(site[0]);    
        }
        res.json(site[0]);    
    })   
    
})

app.get('/trumptwitter', (req, res) => {
    request('https://twitter.com/realDonaldTrump', (err, resp, body) => {
        let site = [];    
        
        if(!err) {
            const $ = cheerio.load(body);
            let links = $('.js-tweet-text-container p');
        
            links.each(function (i, link) {
                site[i] = $(link).text();
            })
        
        }
        res.json(site);
    })
      
})

app.post('/analyze', (req, res) => {
    
    let trumpScore;
    let longTweet = req.body.tweet;  //Returns a string.  

    //Slices the hash tag off of the tweet.
    let tweet = longTweet.slice(0, longTweet.indexOf('#'));

    const tone_analyzer = new ToneAnalyzerV3({
        username: '82a6602e-8426-4c29-be50-bc9a025c4909',
        password: 'sP7BOQmjnbUQ',
        version_date: '2017-09-21'
    });

    const params = {
        text: tweet,
        tones: 'language',
    }

    tone_analyzer.tone(params, (err, resp) => {
        if (!err) {
            trumpScore = resp.document_tone.tones[0];
        } 
        else {
            console.log('error:', err);
        }
        res.json(trumpScore);
    }) 

})

app.post('/NYanalyze', (req, respo) => {
    
    let nyScore;
    let tweetNy = req.body.data;  //Returns a string.  
    
    const tone_analyzer2 = new ToneAnalyzerV3({
        username: '82a6602e-8426-4c29-be50-bc9a025c4909',
        password: 'sP7BOQmjnbUQ',
        version_date: '2017-09-21'
    });

    const params2 = {
        text: tweetNy,
        tones: ['emotion'],
    }

    tone_analyzer2.tone(params2, (err, response) => {
        if (!err) {
            nyScore = response.document_tone.tones[0];
            console.log('success', nyScore)
        } 
        else {
            console.log('error:', err);
        }
        respo.json(nyScore);

    }) 

})

// var params = {
//     // Get the text from the JSON file.
//     text: require('tone.json').text,
//     tones: 'emotion'
//   };
  
//   tone_analyzer.tone(params, function(error, response) {
//     if (error)
//       console.log('error:', error);
//     else
//       console.log(JSON.stringify(response, null, 2));
//     }
//   );

// {
//   "url": "https://gateway.watsonplatform.net/tone-analyzer/api",
//   "username": "82a6602e-8426-4c29-be50-bc9a025c4909",
//   "password": "sP7BOQmjnbUQ"
// }
app.listen(PORT, () => {
    console.log(`Server now listening to ${PORT} =D`);
})
