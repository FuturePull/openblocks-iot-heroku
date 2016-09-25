'use strict';

const router = require('express').Router();

module.exports = function routesIndex(context) {

	/* GET home page. */
	router.get('/', function(req, res, next) {
		res.render('index', {title: 'Express', context});
	});

	//return router;
	return function routerIndex() { return router.apply(this, arguments); };
};
