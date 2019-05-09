import express from "express";
import knex from "../../db/index";
import bodyParser from "body-parser";

import { FIREBASE_SETTINGS } from '../../CONSTANTS';
import * as admin from 'firebase-admin';
const serviceAccount = FIREBASE_SETTINGS;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://case2019k.firebaseio.com"
});

// is this ok?
const member = express.Router();
member.use(bodyParser.json());
member.use(bodyParser.urlencoded({ extended: true }));

// check if the email exists in the database. if it does; register the user
// http://localhost/8787/member/register

member.post("/register", function (req, res) {
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
					.then((result) => {
						console.log(result);
						res.status(200).send(result.email + " successfully registered!").end();
					})
					.catch((error) => {
						res.status(500).send('Firebase error: ' + error.message).end();
					});
			} else {
				res.status(409).send("Error: Email does not exist: " + email).end();
			}
		})
		.catch((error) => {
			console.log(error.message);
			res.status(500).send("Database error: " + error.errno).end();
		});
	} else {
		res.status(400).send('Missing required information!').end();
	}
});


//GET all members
// http://localhost:8787/api/member/all

member.get("/all", function(req, res) {
	knex
		.select()
		.from("Member")
		.then(data => {
			res
				.status(200)
				.send(data)
				.end();
		})
		.catch(error => {
			res
				.status(500)
				.send("Database error: " + error.errno)
				.end();
		});
});

// ADD NEW MEMBER
/** http://localhost:8787/api/member/    with method=POST **/

member.post("/", function(req, res) {
	// Just a start of err handling for model for you
	if (req.body.firstName && req.body.lastName && req.body.email) {
		knex
			.insert(req.body)
			.returning("*")
			.into("Member")

			.then(data => {
				console.log(data);
				res.status(200);
				res.send({
					id: data,
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email
				});
			})
			.catch(error => {
				if (error.errno == 1062) {
					// https://mariadb.com/kb/en/library/mariadb-error-codes/
					res.status(409);
					res.send("Conflict: Member with that name already exists!");
				} else if (error.errno == 1054) {
					res.status(409);
					//to handle error for backend only
					res.send(
						"error in spelling [either in 'firstName' and/or in 'lastname' and or in 'email']."
					);
				} else {
					res.status(400);
					res.send("Database error, Error number: " + error.errno);
				}
			});
	} else {
		res.status(400);
		res.end(
			JSON.stringify({
				error: "first name and /or last name and/or email is missing."
			})
		);
	}
});

// members by id --
/** http://localhost:8787/api/member/    with method=GET **/
// example: http://localhost:8787/api/member/1

member.get("/:id", function(req, res) {
	knex
		.select()
		.from("Member")
		.where("id", req.params.id)
		.then(data => {
			if (data.length == 0) {
				res
					.status(404)
					.send("Invalid row number: " + req.params.id)
					.end();
			} else {
				res
					.status(200)
					.send(data)
					.end();
			}
		})
		.catch(error => {
			res
				.status(500)
				.send("Database error: " + error.errno)
				.end();
		});
});

/** http://localhost:8787/api/member/:id    with method=GET **/
member.delete("/:id", function(req, res) {
  knex
    .delete()
    .from("Member")
    .where("id", req.params.id)
    .then(data => {
      if (((data.length === 0 || isNaN(data)) && data == "") || !data) {
        res
          .status(404)
          .send("Invalid row number: " + req.params.id)
          .end();
      } else {
        res
          .status(200)
          .send("Delete successful! Count of deleted rows: " + data)
          .end();
      }
    })
    .catch(error => {
      res
        .status(500)
        .send("Database error: " + error.errno)
        .end();
    });
});

//UPDATE member
/** http://localhost:8787/api/member/    with method=PUT **/

member.put("/", function (req, res) {
  // Just a start of err handling for model for you
  if (req.body.firstName && req.body.lastName && req.body.email) {
    knex("Member")
      .where("id", req.body.id)
      .update(req.body)
      .then(data => {
        if (data == 0) {
          res
            .status(404)
            .send("Update not successful, " + data + " row modified")
            .end();
        } else {
          res
            .status(200)
            .send("Successfully update member data, " + data + " row modified")
            .end();
        }
      })
      .catch(error => {
        if (error.errno == 1062) {
          // https://mariadb.com/kb/en/library/mariadb-error-codes/
          res.status(409);
          res.send("Conflict: Member with that name already exists!");
        } else if (error.errno == 1054) {
          res.status(409);
          //to handle error for backend only
          res.send(
            "error in spelling [either in 'firstName' and/or in 'lastname' and or in 'email']."
          );
        } else {
          res.status(500);
          res.send("Database error, Error number: " + error.errno);
        }
      });
  } else {
    res.status(400);
    res.end(
      JSON.stringify({
        error: "first name and /or last name and/or email is missing."
      })
    );
  }
});

export default member;
