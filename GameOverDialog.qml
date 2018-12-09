import QtQuick 2.0
import QtQuick.Layouts 1.0
import QtQuick.Dialogs 1.3

Dialog {
    id: gameOverDialog
    visible: false
    title: "Game Over!"
    signal newGameClicked

    contentItem: Rectangle {
            color: "lightskyblue"
            implicitWidth: 400
            implicitHeight: 100
            RowLayout {
                anchors.centerIn: parent
                Text {
                    id: gameOverText
                    text: "Game Over!"
                    color: "navy"
                }
                Text {
                    text: "Score:" + gameArea.score
                    color: "navy"
                }
            }
            MouseArea {
               anchors.fill: parent
               onClicked: gameOverDialog.newGameClicked()
            }
     }
}
