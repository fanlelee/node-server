var http = require('http')
var server = http.createServer(function(req,resp){
    // resp.setHeader('Content-Type','text/plain;charset=gbk')
    resp.setHeader('Content-Type','text/html;charset=utf-8')
    resp.writeHead(200,'haha')
    resp.write('<body>')
    resp.write('<h1>你好哟哟heyheyhaha</h1>')
    resp.write('</body>')
    resp.end()

})
server.listen(8080)