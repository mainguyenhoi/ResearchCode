//This robot roams around a 2D grid. It starts at (0, 0) facing North. After each time it moves, the robot rotates 90 degrees clockwise. 
//Given the amount the robot has moved each time, you have to calculate the robot's final position.
//To illustrate, if the robot is given the movements 20, 30, 10, 40 then it will move:

//20 steps North, now at (0, 20)
//30 steps East, now at (30, 20)
//10 steps South. now at (30, 10)
//40 steps West, now at (-10, 10)
//...and will end up at coordinates (-10, 10).

const robotRoams = (...arg) => {
    let endPoint = [0, 0];
    let way = [0, 1, 1, 0, 0, -1, -1, 0];
    let i = 0;
    arg.forEach(element => {
        switch (i) {
            case 0:
                endPoint[0] = endPoint[0] + element * way[i];
                endPoint[1] = endPoint[1] + element * way[i + 1];
                i = 2;
                break;
            case 2:
                endPoint[0] = endPoint[0] + element * way[i];
                endPoint[1] = endPoint[1] + element * way[i + 1];
                i = 4
                break;
            case 4:
                endPoint[0] = endPoint[0] + element * way[i];
                endPoint[1] = endPoint[1] + element * way[i + 1];
                i = 6
                break;
            case 6:
                endPoint[0] = endPoint[0] + element * way[i];
                endPoint[1] = endPoint[1] + element * way[i + 1];
                i = 0;
                break;
            default: 0
        }
    });
    return endPoint;
}
const robot = robotRoams(0, 1, 0, 2, 0, 3, 0, 4, 0, 5);
console.log(robot);