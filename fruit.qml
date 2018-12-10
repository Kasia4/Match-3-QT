import QtQuick 2.0
import QtQuick.Particles 2.0

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
        Behavior on opacity {
            NumberAnimation { properties:"opacity"; duration: 200 }
        }
    }
    property int type
    property int row
    property int column

    signal clicked(int row, int column, int type)

    property bool dying: false

    property bool spawned: false

    width: parent.blockSize
    height: parent.blockSize
    x: column * width
    y: row * height

    Behavior on x {
        enabled: spawned;
        SpringAnimation{ spring: 2; damping: 0.2 }
    }
    Behavior on y {
        SpringAnimation{ spring: 2; damping: 0.2 }
    }


    ParticleSystem {
        id: sys
        anchors.centerIn: parent
        ImageParticle {
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
            rotationVelocityVariation: 180
        }

        Emitter {
            id: particles
            anchors.centerIn: parent
            emitRate: 0
            lifeSpan: 500
            velocity: AngleDirection {angleVariation: 180; magnitude: 80; magnitudeVariation: 60}
            size: 16
        }
    }

    states: [
        State {
            name: "AliveState"
            when: spawned == true && dying == false
            PropertyChanges { target: img; opacity: 1 }
        },

        State {
            name: "DeathState"
            when: dying == true
            StateChangeScript { script: particles.burst(50); }
            PropertyChanges { target: img; opacity: 0 }
            StateChangeScript { script: fruit.destroy(1000); }
        }
    ]

    MouseArea {
     anchors.fill: parent
     onClicked: parent.clicked(row, column, type)
    }
}
