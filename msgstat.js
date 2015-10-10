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
        res.write("[");

        var tasklist=params["list"];
        
        var taskreturn=new Array();
        console.log(tasklist);
        client.llen(tasklist,function(err,results){
            console.log(results);
            var len=results;
                var redis_list=tasklist;
                if(len!=0){
                    
                    for (var j = 0; j < len; j++) {
                        var taskinfo=client.lindex(redis_list,j);
                        
                        if(j!=len-1)
                        {
                            //console.log(taskinfo.toString());
                            taskinfo.then(function(info){
                                console.log(info.toString());
                                var buf=new Buffer(info);
                                taskreturn[j]=buf;
                                res.write(buf);
                                res.write(",");
                            });
                        }
                        else{
                            console.log("last information");
                            taskinfo.then(function(info){
                                console.log(info.toString());
                                var buf=new Buffer(info);
                                taskreturn[j]=info;
                                var finalbuf=new Buffer(taskreturn);
                                res.write(buf);
                                res.end("]");
                            });
                        }
                    };
                    
                    
                }
                else{
                    console.log("emptylist");
                    res.end("emptylist");  
                }
        });
        
        
          
    });
}).listen(8001, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8001/');