	'use strict';
	try {
		Object.keys(require('../package').dependencies).map(require);
	} catch (e) {
		const spawn = require('child_process').spawn,
			child = process.platform === 'win32' ?
				spawn('cmd', ['/c', 'npm', 'install'], {stdio: 'inherit'}) :
				spawn('npm', ['install'], {stdio: 'inherit'});
		child.on('close', function (code) {
			console.log('child process exited with code ' + code);
		});
	}
