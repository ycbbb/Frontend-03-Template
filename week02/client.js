var net = require('net');
var port = 8081;
var host = '192.168.0.0';

var client= new net.Socket();
client.setEncoding('binary');
//连接到服务端
client.connect(port,host,function(){
    client.write('hello world');
});

client.on('data',function(data){
    console.log('recv data:'+ data);

});
client.on('error',function(error){
    console.log('error:'+error);
    client.destory();

});
client.on('close',function(){
    console.log('Connection closed');
});