(function createHTMLBoard () {
    var board = document.querySelector('#board');

    for(var i = 0; i < 9; i++){
        var tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = `tile-${i}`;
        board.appendChild(tile);
    } 
})();

// This uses the module pattern
const Board = (() => {
    let _tiles = [];
    let _emptyTiles = 9;

    let getTile = (index) => { return _tiles[index] }; 
    let isEmpty = (index) => { return (typeof _tiles[index] === "undefined") ? true : false};
    let isFull = () => { return (_emptyTiles === 0) ? true : false }

    let updateTile = (index, value) => { 
        if (!isEmpty(index)) return false

        document.querySelector(`#tile-${index}`).textContent = value;

        _tiles[index] = value;
        _emptyTiles--;

        return true
    };

    let clearBoard = () => { 
        _tiles = [];
        _emptyTiles = 9;
    };

    return { updateTile, getTile, isFull, clearBoard }
})();

const Player = (name, mark, turn) => {
    let _name = name;
    let _mark = mark;
    let _myTurn = turn;

    let getMark = () => { return _mark};
    let getName = () => { return _name };

    let changeName = (name) => { _name = name; }

    let isMyTurn = () => { return _myTurn };
    let changeTurn = () => { _myTurn = !_myTurn; }


    return { getMark, isMyTurn, changeTurn, changeName, getName };
};

let playerX = Player("Player 1", "x", true);
let playerO = Player("Player 2", "o", false);

// This is a module pattern
const GamePlay = ((board, playerX, playerO) => {
    // This is a factory pattern

    let _playerX = playerX;
    let _playerO = playerO;
    let _board = board;

    let playTile = function (event){
        if(checkForWinner()) return
        
        let currPlayer = (_playerX.isMyTurn()) ? _playerX : _playerO;
        let tileIndex = Number(event.target.id.slice(5));
        let success = _board.updateTile(tileIndex, currPlayer.getMark());
        if (!success) return

        changeTurns();
        declareWinner();
    }

    let changeTurns = () => {
        _playerX.changeTurn();
        _playerO.changeTurn();

        let playerX = document.querySelector("#player-x-name");
        let playerO = document.querySelector("#player-o-name");

        playerX.classList.toggle("my-turn");
        playerO.classList.toggle("my-turn");
    }

    let declareWinner = () =>{
        var winner = checkForWinner();

        if (winner === '') return;

        var result = document.querySelector('#results');
        if (winner === 'tie'){
            result.textContent = 'Game over. You tied!';
        } else {
            var winningPlayer = (winner === 'x') ? _playerX : _playerO;
            result.textContent = `${winningPlayer.getName()}, you won! Congratulations!!`;
        }
    }

    //returns the x or o that won, o.w. returns ''
    let checkForWinner = () => {
        for(var i = 0; i < 3; i++){

            var across = i * 3;
            if(typeof _board.getTile(across) !== 'undefined' && compareTiles(across, across+1, across+2)){
                changeWinningTiles(across, across+1, across+2);
                return _board.getTile(across)
            }

            // down
            if(typeof _board.getTile(i) !== 'undefined' && compareTiles(i, i+3, i+6)){
                changeWinningTiles(i, i+3, i+6);
                return _board.getTile(i)
            }
        }

        // check the diagonals
        if (typeof _board.getTile(4) !== 'undefined' && compareTiles(0, 4, 8)){
            changeWinningTiles(0, 4, 8);
            return _board.getTile(4)
        } 

        if (typeof _board.getTile(4) !== 'undefined' && compareTiles(2, 4, 6)){
            changeWinningTiles(2, 4, 6);
            return _board.getTile(4)
        }

        if (_board.isFull()) return 'tie'

        return ''
    };

    let compareTiles = (ta, tb, tc) => {
        return _board.getTile(ta) === _board.getTile(tb) && _board.getTile(ta) === _board.getTile(tc)
    };

    let changeWinningTiles = (ta, tb, tc) => {
        var tileA = document.querySelector(`#tile-${ta}`);
        var tileB = document.querySelector(`#tile-${tb}`);
        var tileC = document.querySelector(`#tile-${tc}`);

        tileA.classList.add("winning-tile");
        tileB.classList.add("winning-tile");
        tileC.classList.add("winning-tile");
    }

    return { playTile }

})(Board, playerX, playerO);

(function addNameEditEventListeners(){
    let names = Array.from(document.querySelectorAll('.player-name'));
    names.forEach(name => name.addEventListener("input", (e) => {
        var nameHTML = e.target;
        var newName = nameHTML.textContent;
        nameHTML.textContent = newName;

        // get if X or O
        var mark = nameHTML.id.slice(7, 8);
        (mark === 'x') ? playerX.changeName(newName) : playerO.changeName(newName);
        var test = playerX.getName();
        var test2 = playerO.getName();
    }));
    
})();

function f () {
    
}

//add event listeners to tiles
(function addTileEventListeners(){
    let tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach(tile => tile.addEventListener("click", e => {GamePlay.playTile(e)}));
    
})();

(function addRestartEventListener(){
    // clear tiles of classes and text
    var restartBtn = document.querySelector('#restart');
    restartBtn.addEventListener("click", function(){
        var tiles = document.querySelectorAll(".tile");
        tiles.forEach(tile => {
            tile.textContent = '';
            tile.classList.remove('winning-tile');
        });

        // clear tile array
        Board.clearBoard();

        // remove any results
        document.querySelector('#results').textContent = '';
        // restart player turns
    });

})();