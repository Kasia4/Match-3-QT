function index(row, column) {
    return column + (row * gameArea.columns)
}

function startNewGame() {
    hide(gameOverDialog)
    gameArea.score = 0
    initializeField()
}

function createBlock(row, column) {
    var component
    if (component == null)
        component = Qt.createComponent("fruit.qml")

    if (component.status == Component.Ready) {
        var dynamicObject = component.createObject(gameArea)
        if (dynamicObject === null) {
            console.log("error creating block")
            console.log(component.errorString())
            return false
        }
        dynamicObject.row = row
        dynamicObject.column = column
        dynamicObject.type = Math.floor(Math.random() * 5)
        dynamicObject.clicked.connect(handleClick)
        dynamicObject.spawned = true;
        gameArea.field[index(row, column)] = dynamicObject
    } else {
        console.log("error loading block component")
        console.log(component.errorString())
        return false
    }
    return true
}

function clearField() {
    for(var i = 0; i < gameArea.field.length; i++) {
        var block = gameArea.field[i]
        if(block !== null)  {
            block.destroy()
        }
    }
    gameArea.field = []
}

function initializeField() {
    clearField()
    for(var i = 0; i < gameArea.rows; i++) {
        for(var j = 0; j < gameArea.columns; j++) {
            createBlock(i, j)
        }
    }
}

function handleClick(row, column, type) {
    var fieldCopy = gameArea.field.slice()

    var blockCount = getNumberOfConnectedBlocks(fieldCopy, row, column, type)
    if(blockCount >= 3) {
        removeConnectedBlocks(fieldCopy)
        moveBlocksToBottom()
        var score = blockCount * (blockCount + 1) / 2
        gameArea.score += score

        if(isGameOver())
            gameArea.gameOver()
        // just for testing
        if(gameArea.score >= 100)
            gameArea.gameOver()
    }
}

function getNumberOfConnectedBlocks(fieldCopy, row, column, type) {
    if(row >= gameArea.rows || column >= gameArea.columns || row < 0 || column < 0)
        return 0

    var block = fieldCopy[index(row, column)]

    if(block === null)
        return 0

    if(block.type !== type)
        return 0
    var count = 1

    fieldCopy[index(row, column)] = null

    count += getNumberOfConnectedBlocks(fieldCopy, row + 1, column, type)
    count += getNumberOfConnectedBlocks(fieldCopy, row, column + 1, type)
    count += getNumberOfConnectedBlocks(fieldCopy, row - 1, column, type)
    count += getNumberOfConnectedBlocks(fieldCopy, row, column - 1, type)

    return count
}

function removeConnectedBlocks(fieldCopy) {
    for(var i = 0; i < fieldCopy.length; i++) {
        if(fieldCopy[i] === null) {
            var block = gameArea.field[i]
            if(block !== null) {
                block.dying = true
                gameArea.field[i] = null
            }
        }
    }
}

function moveBlocksToBottom() {
    for(var col = 0; col < gameArea.columns; col++) {
        for(var row = gameArea.rows - 1; row >= 0; row--) {
            if(gameArea.field[index(row, col)] === null) {

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
                if(moveBlock === null) {
                    for(var newRow = row; newRow >= 0; newRow--) {
                        createBlock(newRow, col)
                    }
                    break
                }
            }
        }
    }
}

function isGameOver() {
    var gameOver = true
    var fieldCopy = gameArea.field.slice()
    for(var row = 0; row < gameArea.rows; row++) {
        for(var col = 0; col < gameArea.columns; col++) {

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

