var http = require('http')
var path = require('path')
var fs = require('fs')
var url = require('url')
var filePath

var server = http.createServer(function(req,resp){
    // staticRoot(path.join(__dirname,'static'),req,resp)

    console.log(req.url)//     "/index.html?a=1&b=2"    

    console.log(url.parse(req.url))
    // 对象:Url {
        // protocol: null,
        // slashes: null,
        // auth: null,
        // host: null,
        // port: null,
        // hostname: null,
        // hash: null,
        // search: '?t=3&a=2',
        // query: 't=3&a=2',
        // pathname: '/index.html',
        // path: '/index.html?t=3&a=2',
        // href: '/index.html?t=3&a=2' 
    // }

    console.log(url.parse(req.url).pathname) //  '/index.html'

    if(url.parse(req.url).pathname === "/favicon.ico"){
        filePath = path.join()
    }
    if(url.parse(req.url).pathname === "/"){
        url.parse(req.url).pathname = "/index.html"
    }

    var staticPath = path.join(__dirname,'static')
    filePath = path.join(staticPath,url.parse(req.url).pathname)

    fs.readFile(filePath,'binary',function(err,fileContent){
        if(err){
            resp.writeHead(404,"not found文件")
        }else{
            resp.writeHead(200,"OK")
            resp.write(fileContent,"binary")
        }
        resp.end

    })

    resp.end()
})
server.listen(8080)