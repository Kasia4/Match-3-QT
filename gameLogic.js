var maxColumn = 10;
var maxRow = 15;
var maxIndex = maxColumn * maxRow;
var board = new Array(maxIndex);
var component;

//Index function used instead of a 2D array
function index(column, row) {
    return column + (row * maxColumn);
}

function startNewGame() {
    //Calculate board size
    maxColumn = gameArea.columns;
    maxRow = gameArea.rows;
    maxIndex = maxRow * maxColumn;
    //Delete blocks from previous game
    for (var i = 0; i < maxIndex; i++) {
        if (board[i] != null)
            board[i].destroy();
    }


    //Initialize Board
    board = new Array(maxIndex);
    for (var column = 0; column < maxColumn; column++) {
        for (var row = 0; row < maxRow; row++) {
            board[index(column, row)] = null;
            createBlock(column, row);
        }
    }
}

function createBlock(column, row) {
    if (component == null)
        component = Qt.createComponent("fruit.qml");

    // Note that if Block.qml was not a local file, component.status would be
    // Loading and we should wait for the component's statusChanged() signal to
    // know when the file is downloaded and ready before calling createObject().
    if (component.status == Component.Ready) {
        var dynamicObject = component.createObject(gameArea);
        if (dynamicObject == null) {
            console.log("error creating block");
            console.log(component.errorString());
            return false;
        }
        dynamicObject.x = column * gameArea.blockSize;
        dynamicObject.y = row * gameArea.blockSize;
        dynamicObject.width = gameArea.blockSize;
        dynamicObject.height = gameArea.blockSize;
        dynamicObject.type = Math.floor(Math.random() * 5)
        board[index(column, row)] = dynamicObject;
    } else {
        console.log("error loading block component");
        console.log(component.errorString());
        return false;
    }
    return true;
}
