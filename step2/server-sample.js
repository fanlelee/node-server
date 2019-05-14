var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')



var routes = {
    '/a':function(req, resp){

    },
    '/zzz':function(req, resp){

    },
    '/b':function(req, resp){

    },
    '/jiekou4':function(req, resp){

    }
}

http.createServer(function(req, resp){
    if(url.parse(req.url).pathname === "/favicon.ico"){
        resp.end()
    }else{
        rootPath(req, resp)
    }
}).listen(8080)


function rootPath(req, resp){
    var pathObj = url.parse(req.url)
    var routeFn = routes[pathObj.pathname]
    if(routeFn){
        //获取get数据
        req.query = pathObj.query

        //获取post数据
        var body = ''
        req.on('data', function(chunk){
            body += chunk
        }).on('end', function(){
            req.body = parseBody(body)
            routeFn(req, resp)
        })

    }else{
        staticRoot(path.join(__dirname, 'static'), req, resp)
    }
}

function parseBody(body){
    var obj = {}
    body.split('&').forEach(function(value){
        obj[value.split('=')[0]] = value.split('=')[1]
    });

    return obj
}


function staticRoot(path, req, resp){
    var pathname = url.parse(req.url).pathname
    if(pathname === '/'){
        pathname += 'index.html'
    }

    var filePath = path.join(path,pathname)

    fs.readFile(filePath, 'binary', function(err, content){
        if(err){
            resp.writeHead(404, "sorry not found")
            resp.end('sorry not found')
        }else{
            resp.writeHead(200, "ojbk")
            resp.write(content)
            resp.end()
        }
    })
}