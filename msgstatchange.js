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
        
        res.writeHead(200, {
                "Content-Type": "text/plain;charset=utf-8"
            });
        

        var uid=params["usrid"];
        var data=params["msg"];
        var statto=params["changeto"];
        var mylist=data["createid"]+"mytasklist";
        var value=JSON.stringify(data);
        switch(statto)
        {
            case "0":
            var fromlist=uid+"orderlist";
            var tolist=uid+"workinglist";
            
            
            console.log(value);
            var rem=client.lrem(fromlist,1,value);
            var myrem=client.lrem(mylist,1,value);
            rem.then(function(){
                data["taskstat"]="working";
                myrem.then(function(){
                    PushToRedis(tolist,JSON.stringify(data));
                    PushToRedis(mylist,JSON.stringify(data));
                    res.end("changed");
                });
                
            });
            break;
            case "1":
            var fromlist=uid+"workinglist";
            var tolist=uid+"donelist";
            console.log(value);
            var rem=client.lrem(fromlist,1,value);
            var myrem=client.lrem(mylist,1,value);
            rem.then(function(){
                data["taskstat"]="done";
                myrem.then(function(){
                    PushToRedis(tolist,JSON.stringify(data));
                    PushToRedis(mylist,JSON.stringify(data));
                    res.end("changed");
                });
            });
            break;
        }

    });
}).listen(8002, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8002/');

function PushToRedis(uid,taskstr) {
    
    client.lpush(uid, taskstr);
    console.log("PushToRedis:" + uid);
    //client.disconnect();
}