Looper Notes:

Implemented looping
 - initiated by playMultipleGames which takes 5 user inputs: algos for both, skills for both, number of games to play
   * records user inputs in global variables that can be accessed by gameLoop
   * initializes game counter
 
 - calls gameLoop
   * basically just playGame but has a chunk in the game over section that resets board and starts new game with global variables as initial values
   * increments game counter on game over
   * only starts new game if game counter is less than the numbers of games asked for by user
   * only starts new game if boolean 'continue playing' variable is true (meant to be used via button to halt loop)
   
 - commented out game over alert popup from elsewhere, moved it into single-game playGame function
 
 - added in 'all games finished' popup in gameLoop
 
 - 'end after current game' button for loop

# Chess AI
A chess AI, with with different algorithms of increasing intelligence.

Play live version here: https://bay-chess-ai.herokuapp.com/

See my blog post about implementation here: https://byanofsky.com/2017/07/06/building-a-simple-chess-ai/

Based on [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development. See Deployment for notes on how to deploy the project on a live system.

### Prerequisites

You will need to have Node.js and npm installed. For instructions on installing Node, please visit [NPM's documentation on installing Node.js](https://docs.npmjs.com/getting-started/installing-node).

### Installing

You can run npm's initialization to install dependencies from `package.json`.

```
npm init
```

### How to Play

When playing, I recommend having your browser's console open to issue commands and view the computer player's 'thinking' through each move.

#### Play Against Computer

To play against the computer, simply make a move. You will play as the white side. The computer will then make a move.

The computer is currently set to look 3 moves ahead using minimax with alpha beta pruning.

#### Computer vs Computer

If you'd like to have the computer play the computer, you can do so with this command in your browser's console, setting the algorithm you'd like to use, and each computer player's 'skill' level.

```
playGame(algoW=1, skillW=2, algoB=1, skillB=2)
// algo=
// 0 - randomly chooses and evaluation strategy from the numbered ones below to use for the entire game
// 1 - Best move, n moves ahead, minimax with alpha beta pruning (Faster)
// other - random move (else case)
// skillW and skillB are how many moves ahead to look
```

`skillW` and `skillB` only work with alogs 3 & 4. The skill level is what sets how many moves ahead each player will look.

Algo 3 does not use alpha beta pruning, so setting skill levels greater than 2 will make move times very long.

Algo 4 uses alpha beta pruning, so you can set skill level up to 3, maybe even 4. But beyond that, move times will be very long.

## Deployment

You can run this locally with Node.js, and visiting http://localhost:5000.

```
node app.js
```

You can also easily deploy this to a server. It is ready to be deployed to Heroku, with a Procfile included. [Instructions from Heroku](https://devcenter.heroku.com/articles/deploying-nodejs)


## Built With

* [Express](https://expressjs.com) - The web framework used
* [chess.js](https://github.com/jhlywa/chess.js) - Chess library
* [chessboard.js](https://github.com/oakmac/chessboardjs) - Chess board visualization

## Authors

* **Brandon Yanofsky** - *Initial work* - [byanofsky](https://github.com/byanofsky)

## Acknowledgments

* Inspired by [Lauri Hartikka's tutorial](https://medium.freecodecamp.org/simple-chess-ai-step-by-step-1d55a9266977)

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details. Some files have their own licenses, as described in 3rd Party Software below.

## 3rd Party Software

See [LICENSE-3RD-PARTY](LICENSE-3RD-PARTY) file for full licenses

* [chess.js](https://github.com/jhlywa/chess.js)
Copyright (c) 2017, Jeff Hlywa (jhlywa@gmail.com)
* [chessboard.js](https://github.com/oakmac/chessboardjs)
Copyright 2013 Chris Oakman
* [jQuery](https://github.com/jquery/jquery) Copyright JS Foundation and other contributors, https://js.foundation/

## Todo

* Implement Negamax
* Implement sorting function for possible moves to optimize alpha beta pruning
* Better implementation of Express
* Add an element of machine learning
* Improve interface
* Refactor code

v1 notes:
Editing main.js

Goal of this edit: 

- Alter the Computer vs Computer code to allow for opponents to use different algorithms
  * Changed Computer vs Computer playGame() function to take 4 arguments (see below for algo code number changes)
  
     playGame(algo=4, skillW=2, skillB=2) -> playgame(algoW=1, skillW=2, algoB=1, skillB=2)
  * Allows user to set different algorithms for each opponent
  * Added line to check whose turn it is next, and pass along which algo should be used to the move generator, the same way skill was passed along in the original code
  
- Allow for randomization of algorithms and depths
  * Random option for algo and skill variables is 0
  * randomization happens in playGame() when first called, once set to a random option it stays that option throughout that game
  * Sets the chosen variable to a random int 1-3 for skill, and 1 for algo (needs to be updated once evals 2 & 3 implemented)

- Trim the algo options so that eval_1 is =1, since the others aren't necessary for this project.
  * algo = 1 is now the 'Best move, n moves ahead, minimax with alpha beta pruning (Faster)' option
  * else is now 'random move' option, for when a number other than the valid options is chosen
  
- Add details to the text
  * playGame() now also prints section showing algos and skill used by both players (after randomization if specified) to the console at the start and end of game
  * For use in games with random algos and depths

Note: Main will need to be updated to add in eval_2 and eval_3 to the move generator once they are implemented.

Testing comments:
 - Running playGame() with no arguments seems to be working as intended, works just like playGame(1,2,1,2)
 - playGame(1,1,1,1) seems to also work, less CPU intensive due to the shallower depth
 - playGame(1,3,1,3) also works, although was very slow and CPU intensive due to the high depth. Took about 10 minutes to complete.
 - playGame(1,0,1,0) works too, randomization seemes to be working as intended. White got a skill=3, Black got a skill=1. It was interesting seeing the difference in response times and strength of play.

v2 notes:
Editing main.js

Goals of this edit: 
 - Add re-randomization if randomized players end up identical
   * booleans to exclude user-specified values from re-randomization
   * Looped re-randomizer in case re-randomized values end up being identical to the pre-randomization values
 - Add end-game check to see who won or if it was a stalemate
   * End game check correctly shows who won based on who took the final turn
   * Stalemate/draw check added
 - Add turn counter
   * Number of turns determined by the length of the move history array at the end of the game.
   
Post-merge adjustments:
 - Added eval_2 functionality to re-randomizer
 - Added 'edit this' marker comments to the algo rngs to make them easier to find in the code once eval_3 is implemented
 
 File Writer notes;

Goal: to allow the game to write relevant data to an output file once a game is completed.

Note: It looks like there isn't a way to do this directly (due to javascript's built in security protocols), so I'm looking into building in some sort of code that would build a csv file and allow it to be downloaded, as well as adding a 'reset game' button to the html so that multiple games could be run without needing to reload everything from scratch (which would toss out the saved data).

 - Added in a reset button that resets the game and game board
   * resets game and board without clearing out data file (see below)
 
 - Added in button to dowload a csv file with the data from the games run on that instance
   * builds csv file from an array
   * downloads/displays csv file
   * added empty global array to track game results
   * game data objects added at end of each game
   
   
Next objectives:
 - Add in buttons to play single game to html, with input fields for algos and skills
 - Add in function that loops playGame() with specified parameters for a specified number of times without needing any human interaction
