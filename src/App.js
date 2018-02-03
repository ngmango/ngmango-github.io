import React, { Component } from 'react';
import request from 'request';
import cheerio from 'cheerio';
import Twit from 'twit';
import axios from 'axios';
import './App.css';
//import "./"
//import Joy from './Images/Joy.jpg';

class App extends Component {
  constructor() {
    super();

    this.state = {
      trumpTweets: [],
      trumpTweet: '',
      tweetIndex: 0,
      trudeauTweet: '',
      headline: '',
      trumpScore: '',
      trumpEmotion: '',
      trumpSource: '',
      nyScore: '',
      nyEmotion: '',
    }

  }

  componentWillMount() {
    this.trudeauScraper();
    this.getTrumpTwitter();
  }

  componentDidUpdate() {
    //this.getTrumpEmotion();
  }

  getTrumpTweet = (direction) => {
    let newIndex = this.state.tweetIndex + direction;
   
    this.setState({
      trumpTweet: this.state.trumpTweets[newIndex],
      tweetIndex: newIndex,
    });
    this.getTrumpEmotion(this.state.trumpTweet);
  }

  trudeauScraper() {
    axios.get('/trudeau')
    .then(result => {
      this.getNyEmotion(result);
      console.log('google',result.data);
     this.setState({
       trudeauTweet:result.data,
     }) 
	  })
	  .catch(err =>{
		  console.log(err);
	  });
  }

  getNyEmotion = (tweetNy) => {
    axios.post('/NYanalyze', tweetNy)
    .then(result => {
      this.setState({
        nyScore: result.data.score,
        nyEmotion: result.data.tone_name,
      });
      console.log("NY ", result.data)
    })
    .catch(err =>{
      console.log(err)
    });
  }

  //Scrapes the twitter feed and immediately calls for the
  //tone analyzer using the result.
  getTrumpTwitter = () => {
    axios.get('/trumptwitter')
    .then((result) => {
      //Passes the result object.
      this.getTrumpEmotion(result.data[0]);

      this.setState({
        trumpTweets: result.data,
        trumpTweet: result.data[this.state.tweetIndex],
      })
      
	  })
	  .catch(err =>{
		  console.log(err);
	  });
  }

  getTrumpEmotion = (tweet) => {
    axios.post('/analyze', {tweet})
    .then(result => {
      this.setState({ 
        trumpScore: result.data.score,
        trumpEmotion: result.data.tone_name,
        trumpSource: './' + result.data.tone_name + '.jpg'
      });
		  console.log(result.data);
	  })
	  .catch(err =>{
		  console.log(err);
	  });
    
  }

  render() {
    console.log(this.state.trumpEmotion);
    return (
      <div className="App">
        <h1>Trump</h1>
        <h2>Strongest Emotion/Tone: {this.state.trumpEmotion}</h2>
        <h2>Score: {Math.floor(this.state.trumpScore * 100)}/100</h2>
        <img 
        src = {this.state.trumpSource} height="30%" width="30%" 
        /* {(this.state.trumpEmotion === 'Analytical')? "http://media.breitbart.com/media/2016/11/Donald_Trump-Thinking-AP-640x480.jpg" : "" } */
        /* src ={(this.state.trumpEmotion === 'Joy')? "https://maduro.s3.amazonaws.com/uploads/media/post_image/220/saddonald-trump.jpg" : "" } */
        />
        <h4>{this.state.trumpTweet}</h4>
        <button onClick={() => this.getTrumpTweet(-1)}
        disabled={this.state.tweetIndex <= 0 }>Previous Tweet</button>
        <button onClick={() => this.getTrumpTweet(1)}>Next Tweet</button>
        <h1>Trudeau</h1>
        <h2>Strongest Emotion/Tone: {this.state.nyEmotion}</h2>
        <h2>Score: {Math.floor(this.state.nyScore * 100)}/100</h2>

        <h3>{this.state.trudeauTweet}</h3>
      </div>
    );
  }
}

export default App;
