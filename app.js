void function () {
	'use strict';

	const http = require('http');
	const url = require('url');
	const fs = require('fs');

	const list = [getDateTime() + ' STARTED'];
	const releaseDate = 'Release:2016-09-14 00:30 JST, process started:' + getDateTime();

	function getDateTime() {
		return (new Date() + '')
			.replace(' (東京 (標準時))', '')
			.replace(' (JST)', '')
			.replace(' GMT+0900', '')
	}

	http.createServer((req, res) => {
		function ff() {
			res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
			res.write('<p>hello world ' + releaseDate + '</p>\r\n');
			res.write('<form method="POST" action="/endpoint">\r\n');
			res.write('<input name="Data" value="" size="100">\r\n');
			res.write('<input type="submit" value="POST">\r\n');
			res.write('</form>\r\n');
			res.write('<pre>\r\n');
			list.forEach((s, i) => {
				let pos = 0;
				if (s.indexOf(' POST Data=') >= 0)
					s = unescape(s);
				if ((pos = s.indexOf(' POST Data=')) >= 0) {
					try {
						s = s.substr(0, pos + 11) + '\r\n' +
							JSON.stringify(JSON.parse(s.substr(pos + 11)), null, '  ')
								.split('\n')
								.map(s => '                                   ' + s)
								.join('\r\n');
					} catch (e) {
						s += ' ' + e;
					}
				}
				else if ((pos = s.indexOf(' POST Records=')) >= 0) {
					try {
						s = s.substr(0, pos + 14) + '\r\n' +
							JSON.stringify(JSON.parse(s.substr(pos + 14)), null, '  ')
								.split('\n')
								.map(s => '                                   ' + s)
								.join('\r\n');
					} catch (e) {
						s += ' ' + e;
					}
				}
				const ss = s.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;');
				res.write(('  ' + (i + 1)).substr(-3) + ': ' +
					ss + '\r\n');
			});
			res.write('</pre>\r\n');
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
					list.unshift(getDateTime() + ' ' + req.method + ' ' + str);
					if (list.length > 100) list.pop();
					res.writeHead(200, {'Content-Type': 'text/html; charset=UTF-8'});
					res.end('<meta http-equiv="refresh" content="1;URL=/endpoint">');
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
