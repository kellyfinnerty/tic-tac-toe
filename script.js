
// This uses the module pattern
const Board = (() => {
    let _tiles = [];
    let _emptyTiles = 9;
    let _boardCreated = false;

    let getTile = (indx) => { return _tiles[indx] }; 
    let getEmptyTiles = () => { return _emptyTiles };
    let isEmpty = (indx) => { return (typeof _tiles[indx] === "undefined") ? true : false};
    let validIndex = (indx) => { return (indx >= 0 && indx < 9) ? true : false }
    let updateTile = (indx, val) => { 
        if (isEmpty(indx) && _tiles[indx] != validIndex(indx)){
            _tiles[indx] = val;
            _emptyTiles--;

            var tile = document.querySelector(`#tile-${indx}`);
            tile.textContent = val;
            return true
        } else {
            return false
        }
    };
    let clearBoard = () => { 
        _tiles = [];
        _emptyTiles = 9;
    };
    (function createHTMLBoard () {
        if (!_boardCreated){
            var board = document.querySelector('#board');

            for(var i = 0; i < 9; i++){
                var tile = document.createElement('div');
                tile.classList.add('tile');
                tile.id = `tile-${i}`;
                board.appendChild(tile);
            } 

            _boardCreated = true;
        }
    })();
    let checkForWinner = () => {
        //returns the x or o that won, o.w. returns ''
        for(var i = 0; i < 3; i++){
            var across = i * 3;
            if(typeof _tiles[i] === 'undefined' || typeof _tiles[across] === 'undefined') continue

            if(compareTiles(across, across+1, across+2) || compareTiles(i, i+3, i+6)) return _tiles[i]
        }
        // check the diagonals
        if (compareTiles(0, 4, 7) || compareTiles(2, 4, 6)) return _tiles[4]
        if (_emptyTiles === 0) return 'tie'
        return ''
    };
    let compareTiles = (ta, tb, tc) => {
        return _tiles[ta] === _tiles[tb] && _tiles[ta] === _tiles[tc]
    };
    return {
        updateTile,
        getTile,
        getEmptyTiles,
        isEmpty,
        updateTile,
        checkForWinner
    }
})();



// This is a module pattern
const GamePlay = ((board) => {
    // This is a factory pattern
    const Player = (mark, turn) => {
        let _name = `Player`;
        let _mark = mark;
        let _myTurn = turn;

        let getMark = () => { return mark};
        let isMyTurn = () => { return _myTurn };
        let changeTurn = () => { _myTurn = !_myTurn; }
        let changeName = (name) => { _name = name; }
        let getName = () => { return _name };



        return { getMark, isMyTurn, changeTurn, changeName, getName };
    };

    let _playerX = Player("x", true);
    let _playerO = Player("o", false);
    let _board = board;

    //add event listeners to buttons
    (function (){
        let tiles = Array.from(document.querySelectorAll('.tile'));
        tiles.forEach(tile => tile.addEventListener("click", function (event){
            if(_board.checkForWinner()) return
            
            let currPlayer = (_playerX.isMyTurn()) ? _playerX : _playerO;
            let tileIndex = Number(event.target.id.slice(5));
            let success = _board.updateTile(tileIndex, currPlayer.getMark());
            if (!success) return

            changeTurns();


        }));
        
    })();

    let changeTurns = () => {
        _playerX.changeTurn();
        _playerO.changeTurn();

        let playerX = document.querySelector("#player-x-name");
        let playerO = document.querySelector("#player-o-name");

        playerX.classList.toggle("my-turn");
        playerO.classList.toggle("my-turn");
    }

    return { }

})(Board);

