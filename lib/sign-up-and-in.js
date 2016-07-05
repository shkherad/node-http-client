'use strict';

const http = require('http');
const url = require('url');

const formData = JSON.stringify({
  credentials: {
    email: process.argv[2], //pass in email and password from command line
    password: process.argv[3],
  },
});

//error handling will change based on the type of error
const onError = (error) => {
  if (typeof error === 'object' &&
      error.response) {  // if there is an error from the server
    console.error(error.response.statusCode, error.response.statusMessage);
    console.error(error.data);
  } else {
    console.error(error.stack);
  }
};

const onSignIn = (response) => {
  console.log(response);
  console.log('Signed in');
};

const onSignUp = (response) => {
  console.log(response);
  console.log('Signed up');
};

const baseOptions = {
  hostname: 'localhost',
  port: 3000,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': formData.length,
  },
};

const signUpOrIn = (credentials, path, onFulilled, onError) => {
  //take the common configuration options(baseOptions) and add them to a new
  //object which contains the path that we pass in when we invoke this method
  const options = Object.assign({ path }, baseOptions);
  const request = http.request(options, (response) => {
    let data = '';
    response.setEncoding('utf8');
    response.on('error', onError);
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', _ => {
      if (response.statusCode >= 200 &&
          response.statusCode < 300) {
        onFulilled(data);  //if the request is successful call the success callback
      } else {
        onError({ response, data }); //otherwise call the error callback
      }
    });
  });
  request.on('error', onError);
  request.write(credentials);
  request.end();
};

const signIn = (credentials, onFulilled, onRejected) =>
  signUpOrIn(credentials, '/sign-in', onFulilled, onRejected);

const signUp = (credentials, onFulilled, onRejected) =>
  signUpOrIn(credentials, '/sign-up', onFulilled, onRejected);

const onSignUpSuccess = function (response) {
  onSignUp(response);
  signIn(formData, onSignIn, onError);
};

signUp(formData, onSignUpSuccess, onError);
