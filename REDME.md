1. 在服务端开启server 例：`node server.js` 
2. 在浏览器请求localhost 例：`http://localhost:8080`
3. 服务端收到请求并响应   
      ```
      require('http').createServer(function(request, response){
         response.writeHead(200, 'success')
         response.write('hello')
         response.end('byebye')
      }).listen(8080)
      ```
- 响应文件：
```
var filepath = path.join(__dirnamr, url.parse(request.url).pathname)
fs.readFile(filepath, 'binary', function(err, content){
  response.write(content)
})
```
- 响应请求的接口：
```
var routes = {
  '/a':function(){request, response},
  '/b':function(){request, response},
  '/c':function(){request, response},
  ...
}

if(routes[url.parse(request.url).pathname]){
  //get数据 
  request.query = url.parse(request.url).query

  //post数据
  var body
  var bodyObj
  request.on('data',function(chunk){
    body += chunk
  }).on('end', function(){
    body.split('&').forEach(function(value){
      bodyObj[value.split('=')[0]] = value.split('=')[1]
    })
    request.body = bodyObj
  })

  routes[url.parse(request.url).pathname](request, response)
  //使得在进入接口函数时，request里面的数据组装齐全
  
  
}else{
  //读取文件并响应
}
```
