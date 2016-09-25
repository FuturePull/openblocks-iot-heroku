'use strict';

const router = require('express').Router();

module.exports = function routesIndex(context) {

	/* GET test page. */
	router.get('/', function(req, res, next) {
		res.send({query: req.query || null, headers:req.headers});
	});

	/* POST test page. */
	router.post('/', function(req, res, next) {
		res.send({body: req.body || null, headers:req.headers});
	});

	return function routerTest() { return router.apply(this, arguments); };
};
