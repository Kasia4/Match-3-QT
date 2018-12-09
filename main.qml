import QtQuick 2.9
import QtQuick.Window 2.2
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4
import QtQuick.Layouts 1.0
import QtQuick.Dialogs 1.3

import "./gameLogic.js" as GameLogic

ApplicationWindow {
    id: gameWindow
    width: 640
    height: 960
    visible: true
    title: "Match-3"

    style: ApplicationWindowStyle {
            background: BorderImage {
                source: "images/images/background.png"
                border { left: 20; top: 20; right: 20; bottom: 20 }
            }
    }

    statusBar: StatusBar {
           RowLayout {
               anchors.fill: parent
               Label { text: "Score: " + gameArea.score }
           }
           style: StatusBarStyle {
                   padding {
                       left: 8
                       right: 8
                       top: 3
                       bottom: 3
                   }
                   background: Rectangle {
                       implicitHeight: 16
                       implicitWidth: 200
                       gradient: Gradient{
                           GradientStop{color: "#eee" ; position: 0}
                           GradientStop{color: "#ccc" ; position: 1}
                       }
                       Rectangle {
                           anchors.top: parent.top
                           width: parent.width
                           height: 1
                           color: "#999"
                       }
                   }
               }
       }


    GameArea {
        id: gameArea
        score: 0
        blockSize: 60
        Component.onCompleted: GameLogic.startNewGame()
        onGameOver: GameLogic.endGame()
    }

    GameOverDialog {
        id: gameOverDialog
        onNewGameClicked: GameLogic.startNewGame()
    }

}
