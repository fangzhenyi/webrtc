var app = require('express')();
var http = require('http').Server(app);
var WebSocketServer = require('ws').Server;
ws = new WebSocketServer({
    port: 3002
});
var map = {};
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

ws.on('connection', function(socket) {
    console.log("新用户连接");

    socket.send(JSON.stringify({
        "event": "connect"

    }));

    socket.on('message', function(message) {
        console.log('received: %s', message);

        var message = JSON.parse(message);

        switch (message.event) {
            case "join":
                map[message.name] = socket;
                getAlluser(map);

                break;
            case "call":
                console.log("收到call事件");
                map[message.to].send(JSON.stringify({
                    "event": "call",
                    "from": message.from,
                    "sdp": message.sdp
                }))
                break;

            case "answer":
                map[message.to].send(JSON.stringify({
                    "event": "answer",
                    "from": message.from,
                    "sdp": message.sdp
                }))
                break;
            case "candidate":
                map[message.to].send(JSON.stringify({
                    "event": "candidate",
                    "data": message.data
                }));
                break;
            default:

                console.log("消息发送的格式不对");

        }


    });




});


function getAlluser(map) {
    for (var prop in map) {
        if (map.hasOwnProperty(prop)) {
            console.log('用户姓名 ' + prop + '用户对象' + map[prop]);
        }
    }
}

http.listen(3001, function() {
    console.log('listening on *:3001');
});
