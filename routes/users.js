'use strict';

const router = require('express').Router();

module.exports = function routesUsers(context) {

	/* GET users listing. */
	router.get('/', function(req, res, next) {
		res.send('respond with a resource');
	});

	return function routerUsers() { return router.apply(this, arguments); };
};
