'use strict';

const http = require('http');

http.createServer((req, res) => {
	res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
	res.end('<p>hello world 2016-09-11 09:00 JST</p>');
}).listen(process.env.PORT || 3000);
