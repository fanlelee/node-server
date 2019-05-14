var xhr = new XMLHttpRequest()
// xhr.open('GET', '/a?x=3&y=4', true)
// xhr.send()
xhr.open('POST', '/a', true)
xhr.send('username=fff&password=123456789')
xhr.onload = function(){
    console.log(JSON.parse(xhr.responseText))
}