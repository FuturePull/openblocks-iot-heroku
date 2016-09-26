	'use strict';
	const pkg = require('../package')
	try {
		Object.keys(pkg.dependencies).map(require);
	} catch (e) {
		//require('child_process').execSync('npm install');

		const spawn = require('child_process').spawn,
			child = process.platform === 'win32' ?
				spawn('cmd', ['/c', 'npm', 'install'], {stdio: 'inherit'}) :
				spawn('npm', ['install'], {stdio: 'inherit'});

		//child.stdout && child.stdout.on('data', function (data) {
		//	console.log('stdout: ' + data);
		//});

		//child.stderr && child.stderr.on('data', function (data) {
		//	console.log('stderr: ' + data);
		//});

		child.on('close', function (code) {
			console.log('child process exited with code ' + code);
		});

	}

