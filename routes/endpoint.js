'use strict';

const router = require('express').Router();

module.exports = function routesIndex(context) {

	/* GET endpoint page. */
	router.get('/', function(req, res, next) {
		if (JSON.stringify(req.query) !== '{}')
			context.list.unshift({
				time: getDateTime(),
				method: req.method,
				query: req.query,
				headers: req.headers});
		if (context.list.length > 100) context.list.pop();
		if (req.headers['x-get-data'] || !req.headers['user-agent'])
			return res.send({query:req.query || null, headers:req.headers});
		res.render('endpoint', {title: 'End Point', context, req, res});
	});

	/* POST endpoint page. */
	router.post('/', function(req, res, next) {
		if (JSON.stringify(req.body) !== '{}')
			context.list.unshift({
				time: getDateTime(),
				method: req.method,
				body: req.body,
				headers: req.headers});
		if (context.list.length > 100) context.list.pop();
		if (req.headers['x-get-data'] || !req.headers['user-agent'])
			return res.send({body:req.body || null, headers:req.headers});
		res.render('endpoint', {title: 'End Point', context, req, res});
	});

	return function routerEndPoint() { return router.apply(this, arguments); };

	function getDateTime() {
		return (new Date() + '')
			.replace(' (東京 (標準時))', '')
			.replace(' (JST)', '')
			.replace(' GMT+0900', '')
	}

};
