## General info
This repository is backend of KIPI, provide CRUD using RESTFul API   

## Technologies
Project is created with:
* Node version: V12.18.4
* NPM version: V6.14.6
* Google Cloud SQL
* Goole App Engine
* Google Cloud Build

## Setup
To run this project, install it locally using npm:

``` bash
# clone the repo
$ git clone https://github.com/health-troops/kipi-backend

# go into app's directory
$ cd kipi-backend

```

> Configuration Database
```
- Rename .env.example to .env
- Change configuration with your database (this app using MySQL) : 
DB_HOST=<YOUR_DATABASE_HOST>
DB_USER=<YOUR_DATABASE_USER>
DB_PASS=<YOUR_DATABASE_PASSWORD>
DB_NAME=<YOUR_DATABASE_NAME>
DB_PORT=<YOUR_DATABASE_PORT>
```

> Configuration Node Module
```
# in kipi-backend directory

# to install all depedencies
npm install

# to run backend
npm start
```

> Deploy backend to Google Cloud App Engine
```
# In backend directory

# Make sure you already install GOOGLE CLOUD SDK
# Deploy to Google Cloud App Engine
gcloud app deploy

```

> Deploy backend to Google Cloud Build Using CI/CD

<p>create trigger in Google Cloud Build and Connect to your repository<p>

![image](https://user-images.githubusercontent.com/38047246/120410901-1b861600-c37e-11eb-9c3c-4c6bade56ba1.png)

![image](https://user-images.githubusercontent.com/38047246/120411090-6bfd7380-c37e-11eb-8c28-3ce51192eb92.png)

## What's included

```
├── app.yaml           #Config for Google App Engine
│
│__ cloudbuild.yaml    #Config CI/CD using Google Cloud Build   
│__ .env	           #Config database
|__ server.js          #define route and endpoint for backend
|
|
└── package.json       #library and dependencies
```

## Features
* Register & Login
* CRUD Accound, User, Komorbid, Checklist, Form KIPI Daily, and Form Checklist


## Postman Documentation
- LINK : https://www.getpostman.com/collections/24d53fa43d444fb9f1dc