'use strict';

const http = require('http');
const fs = require('fs');
const targetURL = process.env.APPIOT_HOST || 'www.google.com';
console.log('APPIOT_HOST = ' + targetURL);

const opts = {host: targetURL};
const date1 = new Date;
const req = http.request(opts, res => {
	const date2 = new Date;
	try { fs.unlinkSync('client-9.log'); } catch (e) {}
	try { fs.renameSync('client-8.log', 'client-9.log'); } catch (e) {}
	try { fs.renameSync('client-7.log', 'client-8.log'); } catch (e) {}
	try { fs.renameSync('client-6.log', 'client-7.log'); } catch (e) {}
	try { fs.renameSync('client-5.log', 'client-6.log'); } catch (e) {}
	try { fs.renameSync('client-4.log', 'client-5.log'); } catch (e) {}
	try { fs.renameSync('client-3.log', 'client-4.log'); } catch (e) {}
	try { fs.renameSync('client-2.log', 'client-3.log'); } catch (e) {}
	try { fs.renameSync('client-1.log', 'client-2.log'); } catch (e) {}
	try { fs.renameSync('client.log', 'client-1.log'); } catch (e) {}
	const w = fs.createWriteStream('client.log');
	w.write(targetURL + '\n');
	w.write((date2 - date1) + ' msec\n\n');
	console.log((date2 - date1) + ' msec');
	res.pipe(w).on('error', err => console.error(err));
}).end();
