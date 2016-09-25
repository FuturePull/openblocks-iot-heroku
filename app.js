	'use strict';

	/**
	 * Module dependencies.
	 * モジュール依存関係
	 */
	// node standard - Node.js標準
	const http = require('http');
	const path = require('path');
	const fs = require('fs');

	// express関係
	const express = require('express');
	const favicon = require('serve-favicon');
	const logger = require('morgan');
	const debug = require('debug')('app:server');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');
	const serveIndex = require('serve-index');

	debug('start');

	// context - コンテキスト
	const context = {
		list: [getDateTime() + ' STARTED'],
		releaseDate: 'Release:2016-09-26 06:55 JST, process started:' + getDateTime(),
		express: {version: require('express/package').version},
		app: {version: require('./package').version}
	};

	function getDateTime() {
		return (new Date() + '')
			.replace(' (東京 (標準時))', '')
			.replace(' (JST)', '')
			.replace(' GMT+0900', '')
	}

	// initialize app - アプリケーション初期化
	const app = express();

	// view engine setup - ビューエンジン設定
	// app.set('views', path.resolve(__dirname, 'views'));
	app.set('view engine', 'ejs');

	// logger (morgan) - ロガー
	app.use(logger('dev')); // app.use(logger('combined'));
	// favicon お気に入りアイコン
	app.use(favicon(path.resolve(__dirname, 'public', 'favicon.ico')));

	// parser
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(cookieParser());



	// user defined routes - ユーザー定義のルート
	fs.readdirSync('./routes').forEach(name => {
		app.use(
			name === 'index.js' ? '/' : '/' + name.split('.')[0],
			require('./routes/' + name)(context));
	});
	//app.use('/',         require('./routes/index')(context));
	//app.use('/users',    require('./routes/users')(context));
	//app.use('/endpoint', require('./routes/endpoint')(context));
	//app.use('/test',     require('./routes/test')(context));


	// staticファイル
	app.use(express.static(path.resolve(__dirname, 'public')));
	// index directory一覧
	if (app.get('env') === 'development')
		app.use(serveIndex(path.resolve(__dirname, 'public'), {icons: true}));


	// catch 404 and forward to error handler
	app.use(function onError404NotFound(req, res, next) {
		const err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// error handlers - エラー処理
	app.use(
		app.get('env') === 'development' ?
		// development error handler will print stacktrace
		function onError500Development(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		} :
		// production error handler no stacktraces leaked to user
		function onError500Production(err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		}
	);


	/**
	 * Get port from environment and store in Express.
	 * 環境変数PORTからポート番号を取得し、Expressに設定する
	 */
	const PORT = Number(process.env.PORT || '3000');
	app.set('port', PORT);

	/**
	 * Create HTTP server. - HTTPサーバを作成
	 */
	const server = http.createServer(app);

	/**
	 * Listen on provided port, on all network interfaces.
	 * ポートをListenする
	 */
	server.listen(PORT);
	server.on('error', onError);
	server.on('listening', onListening);

	/**
	 * Event listener for HTTP server "error" event.
	 */
	function onError(error) {
		if (error.syscall !== 'listen')
			throw error;

		const bind = 'Port ' + PORT;

		// handle specific listen errors with friendly messages
		switch (error.code) {
			case 'EACCES':
				console.error(bind + ' requires elevated privileges');
				process.exit(1);
				break;
			case 'EADDRINUSE':
				console.error(bind + ' is already in use');
				process.exit(1);
				break;
			default:
				throw error;
		}
	}

	/**
	 * Event listener for HTTP server "listening" event.
	 */
	function onListening() {
		debug('Listening on port ' + server.address().port);
	}

	// APP_URLS polling
	(process.env.APP_URLS || '')
		.split(';')
		.filter(x => x)
		.forEach(x => {
			console.log('start poling:', x);
			const opts = require('url').parse(x);
			opts.method = 'GET';

			http.request(opts, res => 0).end(); 
			setInterval(() => {
				http.request(opts, res => 0).end(); 
			}, 15 * 60 * 1000)
		});
