import express from "express";
import knex from "../../db/index";

const idea = express.Router();

idea.get("/all", function (req, res) {
    knex
        .select()
        .from("Idea")
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
//GET ONE
idea.get("/:id", (req, res) => {
    knex
        .select()
        .from("Idea")
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

//GET BY CATEGORY
idea.get("/byCategory/:id", (req, res) => {
    knex
        .select()
        .from("Idea")
        .where("categoryId", req.params.id)
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

// ADD ONE
function checkIdea(idea) {
    let ideaOK = true;
    if (!idea.name || !idea.description) {
        ideaIsOk = false;
    }
    return ideaOK;
}
export default idea;