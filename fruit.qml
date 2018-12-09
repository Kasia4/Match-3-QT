import QtQuick 2.0

Item {
    id: fruit

    Image {
        id: img
        anchors.fill: parent
        source: {
          if (type == 0)
            return "images/images/apple.png"
          else if(type == 1)
            return "images/images/lemon.png"
          else if (type == 2)
            return "images/images/grapes.png"
          else if (type == 3)
            return "images/images/pear.png"
          else if (type == 4)
            return "images/images/watermelon.png"
        }
    }
    property int type
    property int row
    property int column

    // emit a signal when block is clicked
    signal clicked(int row, int column, int type)

    // handle click event on blocks (trigger clicked signal)
    MouseArea {
     anchors.fill: parent
     onClicked: parent.clicked(row, column, type)
    }
}
