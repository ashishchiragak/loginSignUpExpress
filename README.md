# loginSignUpExpress


To run the project first install all the modules by npm i and then use npm start or node index.js


"host": "localhost:3000",
"Swagger Documentation Link" :- localhost:3000/documentation
"basePath": "/",

API end Points:- "/user/getProfile",
request type:- "GET",
description:- Login via token returning user profile data.

API end Point:- "/user/verifyEmail",
request type:- "GET",
description:- verifies the user email and renders html either with verified successfully or with already verified, user not found.

API end Point:- "/user/loginUser",
request type:- "POST",
description:- user logins into his account by providing his credentials.

API end Point:- "/user/registerUser",
request type:- "POST",
description:- user provides his details to create the account.

request type and resposne type are in JSON.
parameters are passed in formData or raw JSON object only.
