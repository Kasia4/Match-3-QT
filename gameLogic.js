var maxColumn = 10
var maxRow = 15
var maxIndex = maxColumn * maxRow
var board = new Array(maxIndex)
var component

//Index function used instead of a 2D array
function index(row, column) {
    return column + (row * gameArea.columns)
}

function startNewGame() {
    //Calculate board size
    hide(gameOverDialog)
    maxColumn = gameArea.columns
    maxRow = gameArea.rows
    maxIndex = maxRow * maxColumn
//    //Delete blocks from previous game
//    for (var i = 0; i < maxIndex; i++) {
//        if (board[i] != null)
//            board[i].destroy()
//    }


//    //Initialize Board
//    board = new Array(maxIndex);
//    for (var column = 0; column < maxColumn; column++) {
//        for (var row = 0; row < maxRow; row++) {
//            board[index(row, column)] = null
//            createBlock(row, column)
//        }
//    }
    gameArea.score = 0
    initializeField()
}

function createBlock(row, column) {
    if (component == null)
        component = Qt.createComponent("fruit.qml")

    // Note that if Block.qml was not a local file, component.status would be
    // Loading and we should wait for the component's statusChanged() signal to
    // know when the file is downloaded and ready before calling createObject().
    if (component.status == Component.Ready) {
        var dynamicObject = component.createObject(gameArea)
        if (dynamicObject == null) {
            console.log("error creating block")
            console.log(component.errorString())
            return false
        }
        dynamicObject.x = column * gameArea.blockSize
        dynamicObject.y = row * gameArea.blockSize
        dynamicObject.width = gameArea.blockSize
        dynamicObject.height = gameArea.blockSize
        dynamicObject.row = row
        dynamicObject.column = column
        dynamicObject.type = Math.floor(Math.random() * 5)
        dynamicObject.clicked.connect(handleClick)
        //board[index(row, column)] = dynamicObject
        dynamicObject.spawned = true;
        gameArea.field[index(row, column)] = dynamicObject
    } else {
        console.log("error loading block component")
        console.log(component.errorString())
        return false
    }
    return true
}

//TUTAJ NOWE RZECZY

// clear game field
function clearField() {
    // remove entities
    for(var i = 0; i < gameArea.field.length; i++) {
        var block = gameArea.field[i]
        if(block !== null)  {
            block.destroy()
        }
    }
    gameArea.field = []
}

function initializeField() {
    // clear field
    clearField()

    // fill field
    for(var i = 0; i < gameArea.rows; i++) {
        for(var j = 0; j < gameArea.columns; j++) {
            createBlock(i, j)
        }
    }
}

function handleClick(row, column, type) {
    // copy current field, allows us to change the array without modifying the real game field
    // this simplifies the algorithms to search for connected blocks and their removal
    var fieldCopy = gameArea.field.slice()

    // count and delete connected blocks
    var blockCount = getNumberOfConnectedBlocks(fieldCopy, row, column, type)
    if(blockCount >= 3) {
        removeConnectedBlocks(fieldCopy)
        moveBlocksToBottom()

        // calculate and increase score
        // this will increase the added score for each block, e.g. four blocks will be 1+2+3+4 = 10 points
        var score = blockCount * (blockCount + 1) / 2
        gameArea.score += score

        // emit signal if game is over
        if(isGameOver())
            gameArea.gameOver()
        if(gameArea.score >= 100)
            gameArea.gameOver()
    }
}

    // recursively check a block and its neighbors
    // returns number of connected blocks
function getNumberOfConnectedBlocks(fieldCopy, row, column, type) {
    // stop recursion if out of bounds
    if(row >= gameArea.rows || column >= gameArea.columns || row < 0 || column < 0)
        return 0

    // get block
    var block = fieldCopy[index(row, column)]

    // stop if block was already checked
    if(block === null)
        return 0

    // stop if block has different type
    if(block.type !== type)
        return 0

    // block has the required type and was not checked before
    var count = 1

    // remove block from field copy so we can't check it again
    // also after we finished searching, every correct block we found will leave a null value at its
    // position in the field copy, which we then use to remove the blocks in the real field array
    fieldCopy[index(row, column)] = null

    // check all neighbors of current block and accumulate number of connected blocks
    // at this point the function calls itself with different parameters
    // this principle is called "recursion" in programming
    // each call will result in the function calling itself again until one of the
    // checks above immediately returns 0 (e.g. out of bounds, different block type, ...)
    count += getNumberOfConnectedBlocks(fieldCopy, row + 1, column, type) // add number of blocks to the right
    count += getNumberOfConnectedBlocks(fieldCopy, row, column + 1, type) // add number of blocks below
    count += getNumberOfConnectedBlocks(fieldCopy, row - 1, column, type) // add number of blocks to the left
    count += getNumberOfConnectedBlocks(fieldCopy, row, column - 1, type) // add number of bocks above

    // return number of connected blocks
    return count
}

// remove previously marked blocks
function removeConnectedBlocks(fieldCopy) {
    // search for blocks to remove
    for(var i = 0; i < fieldCopy.length; i++) {
        if(fieldCopy[i] === null) {
            // remove block from field
            var block = gameArea.field[i]
            if(block !== null) {
                block.dying = true
                //block.destroy()
                gameArea.field[i] = null
            }
        }
    }
}

// move remaining blocks to the bottom and fill up columns with new blocks
function moveBlocksToBottom() {
    // check all columns for empty fields
    for(var col = 0; col < gameArea.columns; col++) {

        // start at the bottom of the field
        for(var row = gameArea.rows - 1; row >= 0; row--) {

            // find empty spot in grid
            if(gameArea.field[index(row, col)] === null) {

                // find block to move down
                var moveBlock = null
                for(var moveRow = row - 1; moveRow >= 0; moveRow--) {
                    moveBlock = gameArea.field[index(moveRow,col)]

                    if(moveBlock !== null) {
                        gameArea.field[index(moveRow,col)] = null
                        gameArea.field[index(row, col)] = moveBlock
                        moveBlock.row = row
                        moveBlock.y = row * gameArea.blockSize
                        break
                    }
                }

                // if no block found, fill whole column up with new blocks
                if(moveBlock === null) {
                    for(var newRow = row; newRow >= 0; newRow--) {
                        createBlock(newRow, col)
//                        gameArea.field[index(newRow, col)] = newBlock
//                        newBlock.row = newRow
//                        newBlock.y = newRow * gameArea.blockSize
                    }

                    // column already filled up, no need to check higher rows again
                    break
                }
            }

        } // end check rows starting from the bottom
    } // end check columns for empty fields
}

// check if game is over
function isGameOver() {
    var gameOver = true

    // copy field to search for connected blocks without modifying the actual field
    var fieldCopy = gameArea.field.slice()

    // search for connected blocks in field
    for(var row = 0; row < gameArea.rows; row++) {
        for(var col = 0; col < gameArea.columns; col++) {

            // test all blocks
            var block = fieldCopy[index(row, col)]
            if(block !== null) {
                var blockCount = getNumberOfConnectedBlocks(fieldCopy, row, col, block.type)

                if(blockCount >= 3) {
                    gameOver = false
                    break
                }
            }
        }
    }
    return gameOver
}

function show(obj) {
    obj.visible = true
}
function hide(obj) {
    obj.visible = false
}

function endGame() {
    show(gameOverDialog)
}

