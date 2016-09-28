// mini-xhr.js

// http://hakuhin.jp/js/xmlhttprequest.html
// https://ja.wikipedia.org/wiki/XMLHttpRequest

this.MiniXHR = function () {
	'use strict';

	function MiniXHR(baseUrl) {
		this.xhr = new XMLHttpRequest();
		this.baseUrl = baseUrl ? baseUrl : '';
	}

	MiniXHR.prototype.get = function get(url) {
		return this.request('GET', url); };

	MiniXHR.prototype.post = function post(url, data) {
		return this.request('POST', url, data); };

	MiniXHR.prototype.abort = function abort() {
		return this.xhr.abort(); };

	MiniXHR.prototype.request =
	function request(method, url, data) {
		var xhr = this.xhr;
		var baseUrl = this.baseUrl;
		return new Promise(function (resolve, reject) {
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) { // DONE
					if (xhr.status >= 200 && xhr.status < 300) // OK
						resolve(xhr.responseText);
					else
						reject(new Error('status: ' + xhr.status));
				}
			}
			xhr.open(method, baseUrl + url);
			if (typeof data !== 'undefined') {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(data));
			}
			else xhr.send();
		}); // new Promise
	}; // request

	return MiniXHR;

}();
