void function () {
	'use strict';

	const http = require('http');
	const list = ['first'];
	const releaseDate = '2016-09-12 07:00 JST';

	http.createServer((req, res) => {
		if (req.url.startsWith('/endpoint')) {
			if (req.method === 'POST') {
				let str = '';
				req.on('data', (data) => {
					str += data;
				});
				req.on('end', () => {
					list.append(str);
					if (list.length > 100) list.shift();
					res.end('');
				});
			}
			else {
				res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
				res.write('<pre>\r\n');
				list.forEach(s => res.write(s + '\r\n'));
				res.write('</pre>\r\n');
				res.end('<p>hello world ' + releaseDate + '</p>\r\n');
			}
			return;
		}
		res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
		res.end('<p>hello world ' + releaseDate + '</p>');
	}).listen(process.env.PORT || 3000);

} ();
