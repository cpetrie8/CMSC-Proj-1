/**
 * Evaluates current chess board relative to player
 * @param {string} color - Players color, either 'b' or 'w'
 * @return {Number} board value relative to player
 */
var evaluateBoard3 = function(board, color) {
  // Loop through all pieces on the board and sum up total
  var possibleMoves = game.moves();
  var value = 0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 8; j++) {
      if (board[i][j] !== null) {
        // Subtract piece value if it is opponent's piece
        value += getPieceVal(board[i][j], color);
        value += getLocationValue(board[i][j], color, i ,j);
      }
    }
  }

  return value;
};

// Contributes the flat value of a given piece
var getPieceVal = function (piece, color) {
  // Sets the value for each piece using standard piece value
  var pieceValue = {
    'p': 100,
    'n': 300,
    'b': 300,
    'r': 500,
    'q': 900,
    'k': 10000
  };
  return pieceValue[piece['type']] * (piece['color'] === color ? 1 : -1);
};

// Contributes the value of a piece at the square specified
// Relies on a series of tables modified from script.js (algorithm 2)
var getLocationValue = function (piece, color, x, y) {
    var checkTables = function (pieceType, isWhite, x ,y) {
        if (pieceType === 'p') {
            return ( isWhite ? pawnLocWhite[y][x] : pawnLocBlack[y][x] );
        } else if (pieceType === 'r') {
            return ( isWhite ? rookLocWhite[y][x] : rookLocBlack[y][x] );
        } else if (pieceType === 'n') {
            return ( isWhite ? knightLocWhite[y][x] : knightLocBlack[y][x] );
        } else if (pieceType === 'b') {
            return ( isWhite ? bishopLocWhite[y][x] : bishopLocBlack[y][x] );
        } else if (pieceType === 'q') {
            return ( isWhite ? queenLocWhite[y][x] : queenLocBlack[y][x] );
        } else if (pieceType === 'k') {
            return ( isWhite ? kingLocWhite[y][x] : kingLocBlack[y][x] );
        }
        throw "Unknown piece type: " + pieceType;
    };

    var locVal = checkTables(piece.type, piece.color === 'w', x ,y);
    return piece.color === color ? locVal : -locVal;
};

// Generate all moves that attack and defend a given move and assign a value from this
// The move is assumed to already have been performed before this function is called,
// so move.to is used instead of move.from.
// move.piece can't be used, as that returns a compressed char instead of an object
var getHeatValue = function(game, move, value) {
    // prevent repeatedly accessing move.to
    var location = move.to;
    // friendly pieces can't move on top of each other, so this gets attacking pieces
    var attackingPieces = game.moves({square: location}).length;
    
    // save and remove the piece so friendly pieces can now move to that square
    var piece = game.get(location);
    game.remove(location);

    // find friendly "defending" moves by subtracting attacking moves from total moves
    var defendingPieces = (game.moves({square: location}).length) - attackingPieces;
    game.put(piece, location);

    return (defendingPieces - attackingPieces) * (value/10);
};

/**
 * Calculates the best move using Minimax with Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Number} alpha
 * @param {Number} beta
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var genMove = function(depth, game, playerColor,
                            alpha=Number.NEGATIVE_INFINITY,
                            beta=Number.POSITIVE_INFINITY,
                            isMaximizingPlayer=true) {
  // Base case: evaluate board
  if (depth === 0) {
    value = evaluateBoard3(game.board(), playerColor);
    return [value, null];
  }

  // Recursive case: search possible moves
  var bestMove1 = null; // best move not set yet
  var possibleMoves = game.moves({verbose:true});
  // Set random order for possible moves
  possibleMoves.sort(function(a, b){return 0.5 - Math.random()});
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer ? Number.NEGATIVE_INFINITY
                                         : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = genMove(depth-1, game, playerColor, alpha, beta, !isMaximizingPlayer)[0];
    value += getHeatValue(game, move, value);    

    // Undo previous move
    game.undo();

    // Log the value of this move
    console.log(isMaximizingPlayer ? 'Max: ' : 'Min: ', depth, move, value,
                bestMove1, bestMoveValue);

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove1 = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove1 = move;
      }
      beta = Math.min(beta, value);
    }

    // Check for alpha beta pruning
    if (beta <= alpha) {
      console.log('Prune', alpha, beta);
      break;
    }
  }
  // Log the best move at the current depth
  console.log('Depth: ' + depth + ' | Best Move: ' + bestMove1 + ' | ' + bestMoveValue + ' | A: ' + alpha + ' | B: ' + beta);
  // Return the best move, or the only move
  return [bestMoveValue, bestMove1 || possibleMoves[0]];
};

// Locational data
var reverseArr = function(array) {
    return array.slice().reverse();
};

var pawnLocWhite =
    [
        [00,  00,  00,  00,  00,  00,  00,  00],
        [50,  50,  50,  50,  50,  50,  50,  50],
        [10,  10,  20,  30,  30,  20,  10,  10],
        [05,  05,  10,  25,  25,  10,  05,  05],
        [00,  00,  00,  20,  20,  00,  00,  00],
        [05, -05, -10,  00,  00, -10, -05,  05],
        [05,  10, 10,  -20, -20,  10,  10,  05],
        [00,  00,  00,  00,  00,  00,  00,  00]
    ];

var pawnLocBlack = reverseArr(pawnLocWhite);

var knightLocWhite = [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20,  00,  00,  00,  00, -20, -40],
        [-30,  00,  10,  15,  15,  10,  00, -30],
        [-30,  05,  15,  20,  20,  15,  05, -30],
        [-30,  00,  15,  20,  20,  15,  00, -30],
        [-30,  05,  10,  15,  15,  10,  05, -30],
        [-40, -20,  00,  05,  05,  00, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50]
    ];

var knightLocBlack = reverseArr(knightLocWhite);

var bishopLocWhite = [
    [ -20, -10, -10, -10, -10, -10, -10, -20],
    [ -10,  00,  00,  00,  00,  00,  00, -10],
    [ -10,  00,  05,  10,  10,  05,  00, -10],
    [ -10,  05,  05,  10,  10,  05,  05, -10],
    [ -10,  00,  10,  10,  10,  10,  00, -10],
    [ -10,  10,  10,  10,  10,  10,  10, -10],
    [ -10,  05,  00,  00,  00,  00,  05, -10],
    [ -20, -10, -10, -10, -10, -10, -10, -20]
];

var bishopLocBlack = reverseArr(bishopLocWhite);

var rookLocWhite = [
    [  00,  00,  00,  00,  00,  00,  00,  00],
    [  05,  10,  10,  10,  10,  10,  10,  05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [ -05,  00,  00,  00,  00,  00,  00, -05],
    [  00,  00,  00,  05,  05,  00,  00,  00]
];

var rookLocBlack = reverseArr(rookLocWhite);

var queenLocWhite = [
    [ -20, -10, -10, -05, -05, -10, -10, -20],
    [ -10,  00,  00,  00,  00,  00,  00, -10],
    [ -10,  00,  05,  05,  05,  05,  00, -10],
    [ -05,  00,  05,  05,  05,  05,  00, -05],
    [  00,  00,  05,  05,  05,  05,  00, -05],
    [ -10,  05,  05,  05,  05,  05,  00, -10],
    [ -10,  00,  05,  00,  00,  00,  00, -10],
    [ -20, -10, -10, -05, -05, -10, -10, -20]
];

var queenLocBlack = reverseArr(queenLocWhite);

var kingLocWhite = [
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -30, -40, -40, -50, -50, -40, -40, -30],
    [ -20, -30, -30, -40, -40, -30, -30, -20],
    [ -10, -20, -20, -20, -20, -20, -20, -10],
    [  20,  20,  00,  00,  00,  00,  20,  20 ],
    [  20,  30,  10,  00,  00,  10,  30,  20 ]
];

var kingLocBlack = reverseArr(kingLocWhite);
