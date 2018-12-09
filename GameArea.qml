import QtQuick 2.0

Item {
    property int score
    property int blockSize
    anchors.fill: parent
    anchors.margins: 40

    // shall be a multiple of the blockSize
    // the game field is 8 columns by 12 rows big
    width: blockSize * 8
    height: blockSize * 12

    property int rows: Math.floor(height / blockSize)
    property int columns: Math.floor(width / blockSize)

    // array for handling game field
    property var field: []

    // game over signal
    signal gameOver()
}
