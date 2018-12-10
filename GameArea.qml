import QtQuick 2.0

Item {
    property int score
    property int blockSize
    anchors.fill: parent
    anchors.margins: 40

    width: blockSize * 8
    height: blockSize * 12

    property int rows: Math.floor(height / blockSize)
    property int columns: Math.floor(width / blockSize)

    property var field: []

    signal gameOver()
}
