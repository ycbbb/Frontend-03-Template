var net = requi8080re('net');
var timeout = 5000;//超时
var listenPort = 7003;//监听端口

var server = net.createServer(function(socket){
    // 我们获得一个连接 - 该连接自动关联一个socket对象
    socket.remoteAddress + ':' + socket.remotePort);
    socket.setEncoding('binary');
    //接收到数据
    socket.on('data',function(data){
        console.log('recv:' + data);
    });

    //数据错误事件
    socket.on('error',function(exception){
        console.log('socket error:' + exception);
        socket.end();
    });
    //客户端关闭事件
    socket.on('close',function(data){
        console.log('close: ' +
            socket.remoteAddress + ' ' + socket.remotePort);
    });
}).listen(listenPort);

//服务器监听事件
server.on('listening',function(){
    console.log("server listening:" + server.address().port);
});
//服务器错误事件
server.on("error",function(exception){
    console.log("server error:" + exception);
});