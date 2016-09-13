void function () {
	'use strict';

	const http = require('http');
	const fs = require('fs');
	const list = [new Date() + ' first'];
	const releaseDate = '2016-09-12 22:40 JST ' + new Date();

	http.createServer((req, res) => {
		function ff() {
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
			res.write('<pre>\r\n');
			list.forEach(s => res.write(s + '\r\n'));
			res.write('</pre>\r\n');
			res.write('<p>hello world ' + releaseDate + '</p>\r\n');
			res.write('<form method="POST" action="/endpoint">\r\n');
			res.write('<input name="a" value="">\r\n');
			res.write('<input name="b" value="">\r\n');
			res.write('<input type="submit" value="POST">\r\n');
			res.write('</form>\r\n');
			res.end();
		}

		if (req.url.startsWith('/favicon')) {
			res.writeHead(200, {'Content-Type': 'image/x-icon'});
			fs.createReadStream('favicon.ico').pipe(res);
			return;
		}

		if (req.url.startsWith('/endpoint')) {
			if (req.method !== 'GET') {
				let str = '';
				req.on('data', (data) => {
					str += data;
				});
				req.on('end', () => {
					list.push(new Date() + ' ' + req.method + ' ' + str);
					if (list.length > 100) list.shift();
					ff();
				});
			}
			else ff();
			return;
		}
		res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
		res.end('<p>hello world ' + releaseDate + '</p>');
	}).listen(process.env.PORT || 3000);

	(process.env.APP_URLS || '')
		.split(';')
		.filter(x => x)
		.forEach(x => {
			const opts = url.parse(x);
			opts.method = 'GET';

			http.request(opts, res => 0).end(); 
			setInterval(() => {
				http.request(opts, res => 0).end(); 
			}, 15 * 60 * 1000)
		});

} ();
