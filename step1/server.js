var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')



var server = http.createServer(function(req, resp){
    if(url.parse(req.url).pathname === "/favicon.ico"){
        return
    }
    staticRoot(path.join(__dirname, 'static'), req, resp)
})

function staticRoot(staticPath, req, resp){
    var pathObj = url.parse(req.url)

    if(pathObj.pathname === '/'){
        pathObj.pathname += "index.html"
    }

    var filePath = path.join(staticPath, pathObj.pathname)

    // var fileContent = fs.readFileSync(filePath,'binary') //同步读取

    fs.readFile(filePath, "binary", function(err, fileContent){   //异步读取
        if(err){
            resp.writeHead(404, "not found yeah")
            resp.end('<h1>not found</h1>')
        }else{
            resp.writeHead(200, "OK yes")
            resp.write(fileContent, "binary")
            resp.end()
        }
    })
}

server.listen(8080)