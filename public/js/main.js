var gameDataArray = [
  //starts empty, elements added on gameover in playGame()
];

var continuePlaying = true;

// Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(algo, skill=3) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('Game Over');
    alert('Game Over');
    return;
  }
  // Calculate the best move, using chosen algorithm
  if (algo === 1) {
    var move = calcBestMove(skill, game, game.turn())[1];
    game.move(move);
  } else if (algo === 2) {
    var move = getBestMove(skill, game, game.turn());
    game.ugly_move(move);
  } else if (algo === 3) {
    var move = genMove(skill, game, game.turn())[1];
    game.move(move);
  } else {
    var move = randomMove();
    game.move(move);
  }
  // Update board positions
  board.position(game.fen());
}

// Computer vs Computer
var playGame = function(algoW=1, skillW=2, algoB=1, skillB=2) {
  
  if (game.game_over() === true) {
    console.log('Game Over');
    console.log('White: algo=' + algoW + ' skill=' + skillW);
    console.log('Black: algo=' + algoB + ' skill=' + skillB);
    console.log('Number of Turns: ' + game.history().length);
    var gameWinner = '0';
    if (game.in_stalemate() || game.in_draw()){ 
       console.log('Stalemate / Draw');
       gameWinner = 'sd';
    } else if (game.turn() === 'w'){ //Because if the next turn is white, the final turn must've been black
       console.log('Black wins');
       gameWinner = 'b'
    } else {
       console.log('White wins');
       gameWinner = 'w';
    }
    
    //build object to record data from this game
    var thisGameData = {
      whiteAlgo: algoW, 
      whiteSkill: skillW, 
      blackAlgo: algoB, 
      blackSkill: skillB, 
      gameLength: game.history().length, 
      winner: gameWinner};
    
    //add object to array
    gameDataArray.push(thisGameData);
    
    alert('Finished game.');
    
    return;
  }
  
  //randomizers for algo and skill, run once at start of game
  //algo randomizers need to be implemented once other evals are implemented
  
  //booleans for which pieces are randomized, so user-specified values won't be affected by the re-randomizer
  var aW_Random = false;
  var sW_Random = false;
  var aB_Random = false;
  var sB_Random = false;

  if (algoW === 0){
    algoW = Math.floor((Math.random() * 3) + 1);
    aW_Random = true;
  }
  if (skillW === 0){
    //sets skill to a random int between 1 and 3
    skillW = Math.floor((Math.random() * 3) +1);
    sW_Random = true;
  }
  if (algoB === 0){
    algoB = Math.floor((Math.random() * 3) + 1);
    aB_Random = true;
  }
  if (skillB === 0){
    skillB = Math.floor((Math.random() * 3) +1);
    sB_Random = true
  }

  //re-randomizer for when two random or semirandom players are identical
  if (aW_Random || sW_Random || aB_Random || sB_Random){
    //loop in case re-randomization gives same values as initial randomization
    while (algoW === algoB && skillW === skillB){
      if (aW_Random){
        algoW = Math.floor((Math.random() * 3) +1);
      } else if (aB_Random){
        algoB = Math.floor((Math.random() * 3) +1);
      } else if (sW_Random){
        skillW = Math.floor((Math.random() * 3) +1);
      } else {
        skillB = Math.floor((Math.random() * 3) +1);
      }
    }
  }
  
  console.log('White: algo=' + algoW + ' skill=' + skillW);
  console.log('Black: algo=' + algoB + ' skill=' + skillB);
  
  var skill = game.turn() === 'w' ? skillW : skillB;
  var algo = game.turn() === 'w' ? algoW : algoB;
  makeMove(algo, skill);
  window.setTimeout(function() {
    playGame(algoW, skillW, algoB, skillB);
  }, 250);
};

var origAlgW;
var origDepthW;
var origAlgB;
var origDepthB;
var gameCount = 0;
var totNumGames;

var playMultipleGames = function (algW, depthW, algB, depthB, nGames){
  resetBoard();
  origAlgW = algW;
  origDepthW = depthW;
  origAlgB = algB;
  origDepthB = depthB;
  gameCount = 0;
  totNumGames = nGames;
  
  window.setTimeout(function() {
    gameLoop(algW, depthW, algB, depthB);
  }, 250);
}

//intended to play multiple games in a row, note: normal loops don't work due to playGame's recursion, need to figure out a workaround
var gameLoop = function(algoW=1, skillW=2, algoB=1, skillB=2) {
  
   if (game.game_over() === true) {
    gameCount++;
    console.log('Game Over');
    console.log('White: algo=' + algoW + ' skill=' + skillW);
    console.log('Black: algo=' + algoB + ' skill=' + skillB);
    console.log('Number of Turns: ' + game.history().length);
    var gameWinner = '0';
    if (game.in_stalemate() || game.in_draw()){ 
       console.log('Stalemate / Draw');
       gameWinner = 'sd';
    } else if (game.turn() === 'w'){ //Because if the next turn is white, the final turn must've been black
       console.log('Black wins');
       gameWinner = 'b'
    } else {
       console.log('White wins');
       gameWinner = 'w';
    }
    
    //build object to record data from this game
    var thisGameData = {
      whiteAlgo: algoW, 
      whiteSkill: skillW, 
      blackAlgo: algoB, 
      blackSkill: skillB, 
      gameLength: game.history().length, 
      winner: gameWinner};
    
    //add object to array
    gameDataArray.push(thisGameData);
     
    //start new game
    if (continuePlaying && gameCount < totNumGames){
      console.log('Resetting, starting next game.');
      resetBoard();
      window.setTimeout(function() {
        gameLoop(origAlgW, origDepthW, origAlgB, origDepthB);
      }, 250);
    } else {
       console.log('Finished game loop ' + totNumGames);
       alert('Finished ' + gameCount + ' games');
       continuePlaying = true;
       gameCount = 0;
    }
    
    return;
  }
  
  //randomizers for algo and skill, run once at start of game
  //algo randomizers need to be implemented once other evals are implemented
  
  //booleans for which pieces are randomized, so user-specified values won't be affected by the re-randomizer
  var aW_Random = false;
  var sW_Random = false;
  var aB_Random = false;
  var sB_Random = false;

  if (algoW === 0){
    algoW = Math.floor((Math.random() * 3) + 1); 
    aW_Random = true;
  }
  if (skillW === 0){
    //sets skill to a random int between 1 and 3
    skillW = Math.floor((Math.random() * 3) +1);
    sW_Random = true;
  }
  if (algoB === 0){
    algoB = Math.floor((Math.random() * 3) + 1);
    aB_Random = true;
  }
  if (skillB === 0){
    skillB = Math.floor((Math.random() * 3) +1);
    sB_Random = true
  }

  //re-randomizer for when two random or semirandom players are identical
  if (aW_Random || sW_Random || aB_Random || sB_Random){
    //loop in case re-randomization gives same values as initial randomization
    while (algoW === algoB && skillW === skillB){
      if (aW_Random){
        algoW = Math.floor((Math.random() * 3) +1);
      } else if (aB_Random){
        algoB = Math.floor((Math.random() * 3) +1);
      } else if (sW_Random){
        skillW = Math.floor((Math.random() * 3) +1);
      } else {
        skillB = Math.floor((Math.random() * 3) +1);
      }
    }
  }
  
  console.log('White: algo=' + algoW + ' skill=' + skillW);
  console.log('Black: algo=' + algoB + ' skill=' + skillB);
  
  var skill = game.turn() === 'w' ? skillW : skillB;
  var algo = game.turn() === 'w' ? algoW : algoB;
  makeMove(algo, skill);
  window.setTimeout(function() {
    gameLoop(algoW, skillW, algoB, skillB);
  }, 250);
  
};

var stopPlaying = function(){
  continuePlaying = false;
};

var resetBoard = function(){
  //resets game, meant to be used via reset button
  game.reset();
  board.start();
};

// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });

  // If illegal move, snapback
  if (move === null) return 'snapback';

  // Log the move
  console.log(move)

  // make move for black
  window.setTimeout(function() {
    makeMove(1, 3);
  }, 250);
};

var convertArrayOfObjectsToCSV = function(args) {  
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            console.log("Empty array");
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

var downloadCSV = function() {  
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: gameDataArray
        });
        if (csv == null) return;

        filename = 'chess_export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        } 
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
