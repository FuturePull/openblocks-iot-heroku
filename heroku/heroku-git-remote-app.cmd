@set /p APP_NAME="heroku APP_NAME? "
heroku git:remote -a %APP_NAME%
@pause
