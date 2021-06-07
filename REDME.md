##### 目的
手写简易版搭建一个既能提供静态文件，又能处理动态路由mock数据的服务器。
##### 前提
会用到nodejs的几个内置模块：
```js
var http = require('http') //启动server
var fs = require('fs') //读取文件
var path = require('path') //处理路径
var url = require('url') //解析请求url的信息
```
#### 一. 入口，server.js：
```js
var http = require('http')
http.createServer((request, response)=>{
    response.setHeader('Content-Type','text/html;charset=utf-8')
    response.writeHead(200,'success')//响应状态码
    response.write('<body>')
    response.write('<h1>你好</h1>')
    response.write('</body>')
    response.end()
})
http.listen(8888)//自定义端口号
```
- 本地启动：`node server.js`
- 浏览器访问：http://localhost:8888/
- 响应`response.write`里面的内容并展示在浏览器：代码为`<body><h1>你好</h1></body>`
#### 二、获取静态文件
在以上基础上，如果将响应内容`<body><h1>你好</h1></body>`替换成脚本文件，就需要**获取文件路径**，然后**读取到文件内容**。
1. 获取文件路径:
    `var filePath = path.join(path.join(__dirname, 'static'),   url.parse(req.url).pathname)`
   - `__dirname`：当前文件路径;
   - `path.join(__dirname, 'static')`，nodejs内置模块'path'，`path.join(__dirname, 'static')`，用`path.join()`拼接路径是为了统一路径的不同写法并得到一个**绝对路径**，`static`作为脚本文件的文件夹名；
        ![目录结构](https://i.loli.net/2021/06/07/WEh23TIeM1bLRKO.png)
     - `url.parse(req.url).pathname`，解析出url的相关信息，pathname为脚本文件名。

2. 读取文件内容：

   ```js
    // var fileContent = fs.readFileSync(filePath,'binary') //同步读取

    fs.readFile(filePath, "binary", function(err, fileContent){   //异步读取
        if(err){
            resp.writeHead(404, "not found yeah")
            resp.end('<h1>not found</h1>')
        }else{
            resp.writeHead(200, "success")
            resp.write(fileContent, "binary")
            resp.end()
        }
    })
   ```

3. 完整代码：
    ```js
        var http = require('http')
        var path = require('path') //统一路径写法
        var fs = require('fs')  //获取文件信息
        var url = require('url') //解析url的信息

        var server = http.createServer(function(req, resp){
            if(url.parse(req.url).pathname === "/favicon.ico"){
                return
            }
            staticRoot(path.join(__dirname, 'static'), req, resp)
        }).listen(8888)

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
                    resp.writeHead(200, "success")
                    resp.write(fileContent, "binary")
                    resp.end()
                }
            })
        }
    ```
      以上，包括对应的css、js、imgs文件也能获取到。
#### 三、处理动态路由
当然，到第二步已经能获取响应**脚本文件**，但也有**接口请求**的情况或者需要**mock数据**，这时需要根据请求的不同url给出不同的响应，而非读取脚本文件。
    **既能提供静态文件，又能处理动态路由**：
   - 思路：首先给出一个**路由表**，解析出不同请求的url里面` url.parse(request.url).pathname`如果存在路由表的对应路径，就转而处理对应路径的函数，否则就回到第二步，继续去读取响应脚本文件。
   - 完整代码：
   ```js
        var http = require('http')
        var fs = require('fs')
        var path = require('path')
        var url = require('url')

        var routes = {
            '/a': function (req, resp) {
                // resp.setHeader('Content-Type','text/js;charset=utf-8')
                // resp.end(JSON.stringify(req.query))
                resp.end(JSON.stringify(req.body))
            },
            '/b': function (req, resp) {

            },
            '/c': function (req, resp) {

            }
        }

        http.createServer(function (request, response) {
            if (url.parse(request.url).pathname === '/favicon.ico') {
                response.end()
            } else {
                rootPath(request, response)
            }
        }).listen(8080)

        function rootPath(request, response) {
            var pathObj = url.parse(request.url)
            var routeFn = routes[pathObj.pathname]
            if (routeFn) {
                request.query = pathObj.query //GET数据

                var body = ''
                request.on('data', function (chunk) {
                    body += chunk
                }).on('end', function () {
                    request.body = parseBody(body) //POST数据 
                    routeFn(request, response)
                })
            } else {
                rootStatic(request, response)
            }
        }

        //将字符串'a=1&b=2'转换为对象{a:1, b:2}
        function parseBody(body) { 
            var bodyObj = {}
            body.split('&').forEach(function (cont) {
                bodyObj[cont.split('=')[0]] = cont.split('=')[1]
            })
            return bodyObj
        }


        function rootStatic(request, response) {
            var pathName = url.parse(request.url).pathname

            if (pathName === '/') {
                pathName += 'index.html'
            }

            pathName = path.join('static', pathName)
            var filePath = path.join(__dirname, pathName)
            fs.readFile(filePath, 'binary', function (err, content) {
                if (err) {
                    response.writeHead(404, "not found")
                    response.end('not found')
                } else {
                    response.writeHead(200, 'success yes')
                    response.write(content, 'binary')
                    response.end()
                }
            })
        }   
   ```
[源码地址](https://github.com/fanlelee/node-server)
[文章链接](https://www.jianshu.com/u/7cdcf92ccaf6
)
        


