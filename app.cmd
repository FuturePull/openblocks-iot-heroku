@rem set DEBUG=app:*,express:*
node tools/prestart
set APP_URLS=http://localhost:3000
set DEBUG=app:*,express:application,express:router
start npm start
start http://localhost:3000
pause
