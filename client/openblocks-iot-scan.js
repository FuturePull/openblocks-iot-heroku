// openblocks-iot-scan

(function () {
	'use strict';

	const url = require('url');
	const http = require('http');
	const port = 880; // OpenBlocks IoT Web Port
	const NL = '\r\n';
	console.log((new Date).toLocaleString() + ' started...');
	const netIf = require('os').networkInterfaces();

	const ipList = Object.keys(netIf)
		.filter(name => !name.startsWith('VMware Network Adapter '))
		.map(name => netIf[name]
			.filter(y => !y.internal && y.family === 'IPv4')
			.map(y => ({ip:y.address, name}))
			[0])
		.filter(x => x && !x.ip.startsWith('169.254.'));
	console.log(ipList.map(x => x.name + ': ' + x.ip).join('\r\n'));
	//return process.exit();

	process.on('uncaughtException', err =>
		console.log((new Date).toLocaleString() + ' uncaughtException: ' + err));

	ipList.forEach(x => {
		const ip = x.ip.split('.').slice(0, 3).concat('*').join('.');
		process.stdout.write(x.name + ': ' + x.ip + ', Scan: ' + ip + ':' + port + ', Requests:');

		for (let octet = 1; octet < 255; ++octet) {
			if (octet % 10 === 0) process.stdout.write('.');

			((octet) => {
				const opts = url.parse('http://' +
					ip.replace('*', octet) + ':' + port);
				opts.method = 'GET';
				const host = opts.host + '   '.substr((octet + '').length);

				const time1 = new Date();
				const req = http.request(opts, res => {
					console.log(x.name + ': ' + host + ' ' +
						((new Date() - time1)/1000).toFixed(3) + ' sec OK connected.');
					require('child_process').exec('start http://' + opts.host);
				});
				req.end();
				req.on('error', err =>
					err.code === 'ETIMEDOUT' ||
					console.log(x.name + ': ' + host + ' ' +
						((new Date() - time1)/1000).toFixed(3) + ' sec ' + err));
			}) (octet);

		} // for octet
		process.stdout.write(NL);

	}); // ipList.forEach

	//setTimeout(process.exit, 12000);

})();
