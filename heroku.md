heroku readme
====

```
$ heroku login
```

Create a new Git repository

```
$ cd my-project/
$ git init
$ heroku git:remote -a APP-NAME
```


Deploy your application

```
$ git add .
$ git commit -am "make it better"
$ git push heroku master
```


Existing Git repository

```
$ heroku git:remote -a APP-NAME
```
