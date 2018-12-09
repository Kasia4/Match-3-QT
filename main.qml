import QtQuick 2.9
import QtQuick.Window 2.2
import QtQuick.Controls 1.4
import QtQuick.Controls.Styles 1.4

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

    GameArea {
        id: gameArea
        score: 0
        blockSize: 60
        Component.onCompleted: GameLogic.startNewGame()
    }
}
