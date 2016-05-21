var redis = require('ioredis');
var client = new redis();
var http = require('http');
var url = require("url");
var querystring = require("querystring");
http.createServer(function (req, res) {
    // 设置接收数据编码格式为 UTF-8
    req.setEncoding('utf-8');
    var postData = ""; //POST & GET ： name=zzl&email=zzl@sina.com
    // 数据块接收中
    req.addListener("data", function (postDataChunk) {
        postData += postDataChunk;
    });
    // 数据接收完毕，执行回调函数
    req.addListener("end", function () {
        console.log('数据接收完毕');
        var params = JSON.parse(postData);
        console.log(params);
        console.log(params["usrname"]);
        console.log(params["usrid"]);
        var usroder=params["usrid"]+"orderlist"; 
        var mylist=params["createid"]+"mytasklist";
        PushToRedis(usroder,postData);
        PushToRedis(mylist,postData);
        res.writeHead(200, {
            "Content-Type": "text/plain;charset=utf-8"
        });
        res.end("数据提交完毕");
    });
}).listen(8000, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8000/');

//表单接收完成后，再处理redis部分
function PushToRedis(uid,taskstr) {
    
    client.lpush(uid, taskstr);
    console.log("PushToRedis:" + uid);
    //client.disconnect();
}