import express from "express";
import bodyParser from "body-parser";
import knex from "../../db/index";

import { FIREBASE_SETTINGS } from '../../CONSTANTS';
import * as admin from 'firebase-admin';
const serviceAccount = FIREBASE_SETTINGS;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://case2019k.firebaseio.com"
});

const auth = express.Router();
auth.use(bodyParser.json());
auth.use(bodyParser.urlencoded({ extended: true }));

// verify user id token
auth.get('/', (req, res) => {
  let idToken;
  if (req.headers.token) idToken = req.headers.token;

  // idToken comes from the client app
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => decodedToken.uid)
    .then((uid) => {
      admin.auth().getUser(uid) // get user info with the user id
        .then(user => res.status(200).send(JSON.stringify(user.email)).end())
        .catch(error => res.status(500).send(error.message).end());
    })
    .catch((error) => res.status(401).send(error.message).end());
});

// check the db before allowing user registration
auth.post("/register", function (req, res) {
  const email = req.body.account.email.length > 0 ? req.body.account.email : undefined;
  const password = req.body.account.password.length > 0 ? req.body.account.password : undefined;
  const firstname = req.body.account.firstname.length > 0 ? req.body.account.firstname : undefined;
  const surname = req.body.account.surname.length > 0 ? req.body.account.surname : undefined;

  if (email && password && firstname && surname) {
    knex.select().from("Member").where("email", email)
      .then((data) => {
        if (data.length !== 0) { // if the email exists, allow firebase registration
          admin.auth().createUser({
            email: email,
            password: password,
          })
            .then(result => res.status(200).send(result.email + " successfully registered!").end())
            .catch(error => res.status(500).send('Firebase error: ' + error.message).end());
        } else {
          res.status(409).send("Error: Email does not exist: " + email).end();
        }
      })
      .catch(error => res.status(500).send("Database error: " + error.errno).end());
  } else {
    res.status(400).send('Missing required information!').end();
  }
});

export default auth;