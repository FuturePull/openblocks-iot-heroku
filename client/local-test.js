'use strict';

const http = require('http');
const url = require('url');
const opts = url.parse('http://localhost:3000/test');
const optsGet = url.parse('http://localhost:3000/test?a=1&b=2');

const f = res => {
	res.on('data', data => {
		console.log('===========================');
		console.log(res.headers);
		console.log(data + '');
	});
};

optsGet.method = 'GET';
optsGet.headers = {'connection': 'keep-alive'};
http.request(optsGet, f).end();

setTimeout(() => {
	opts.method = 'POST';
	opts.headers = {'content-type': 'application/json',
		'connection': 'keep-alive'};
	http.request(opts, f).end('{"a":11,"b":22}')
}, 200);

setTimeout(() => {
	opts.method = 'POST';
	opts.headers = {'content-type': 'application/x-www-form-urlencoded',
		'connection': 'keep-alive'};
	http.request(opts, f).end('Data=データ')
}, 600);
