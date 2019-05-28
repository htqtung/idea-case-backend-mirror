import express from "express";
import knex from "../../db/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import keys from "../../config/keys";

const user = express.Router();

user.get("/", (req, res) =>
  res.json({
    msg: "User Works"
  })
);

//GET USERS
user.get("/all", function(req, res) {
  knex
    .select()
    .from("User")
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

//REGISTER USER
user.post("/register", (req, res) => {
  if (req.body.email && req.body.user_name && req.body.password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) throw err;
        req.body.password = hash;
        knex
          .insert(req.body)
          .returning("*")
          .into("User")
          .then(data => {
            // console.log(req.body);
            res.status(200);
            res.send({
              id: data,
              email: req.body.email,
              username: req.body.user_name,
              password: req.body.password
            });
          });
      });
    });
  } else {
    res.status(400);
    res.end(
      JSON.stringify({
        error: "User name and /or password and/or email is missing."
      })
    );
  }
});

//LOGIN USER
user.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  knex
    .select("*")
    .from("User")
    .where("email", email)
    .then(rawData => {
      // let data = JSON.stringify(rawData[0]);
      // console.log(data);
      if (!rawData) {
        return res.status(404).json("User not found");
      }
      bcrypt.compare(password, rawData[0].password).then(isMatch => {
        if (isMatch) {
          //User matched

          const payload = {
            id: rawData[0].id,
            name: rawData[0].user_name,
            email: rawData[0].email
          };

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          return res.status(400).json("Password Incorrect");
        }
      });
    });
});

//GET USER BY ID
user.get("/:id", function(req, res) {
  knex
    .select()
    .from("User")
    .where("id", req.params.id)
    .then(data => {
      if (data.length == 0) {
        res
          .status(404)
          .send("User " + req.params.id + " not found ")
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

// DELETE USER
user.delete("/:id", function(req, res) {
  knex
    .delete()
    .from("User")
    .where("id", req.params.id)
    .then(data => {
      console.log(data);
      if (data == 0) {
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

export default user;
