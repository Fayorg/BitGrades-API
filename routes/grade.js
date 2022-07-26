const auth = require('../utils/authMiddleware');
const express = require("express");
const crypto = require('crypto');
const pool = require("../utils/database");
const handleServerError = require("../utils/ErrorHandler/ServerError");
const handleNoItemFoundError = require("../utils/ErrorHandler/NoItemFound");
const router = express.Router();

router.get("/", auth.authentication, async (req, res) => {

    /*

        IF there's no arguments passed with the request, just return the last 30 grades.
        IF there's an ID provided with the request, then return the grade.
        IF there's start or/end end argument return the selected grades.

    */

    try {
        if(req.body.ID) {
            let grades = await pool.query("SELECT Grades.ID, Subjects.Name, Grades.DisplayName, Grades.Grade, Grades.MaxPoints, Grades.Points, Grades.CreatedAt FROM Grades INNER JOIN Subjects ON Grades.Subject=Subjects.ID WHERE Grades.UserID = ? AND Grades.ID = ?", [req.user.ID, req.body.ID]);
            if(grades[0] == null) { handleNoItemFoundError(res); return; }
            res.status(200).send({ result: true, value: (grades[0]) });
        } else {
    
        }
    } catch(err) {
        handleServerError(err, res, { path: "/grade", method: "GET" });
    }
});

router.post("/", auth.authentication, async (req, res) => {
    try {

        if(!req.files || Object.keys(req.files).length == 0) { res.status(401).send({ result: false, message: "No files where sent!"}); return; }
        if(!req.body.subject || !req.body.grade || !req.body.name) { res.status(401).send({ result: false, message: "Missing some required fields!"}); return; }

        let scan = req.files.scan;
        let ext = scan.name.split('.')[scan.name.split('.').length - 1];

        if(ext != "pdf") { res.status(401).send({ result: false, message: "This file extension cannot be sent!"}); return; }

        let id = crypto.randomBytes(32).toString('hex');

        await pool.query("INSERT INTO Grades (ID, Subject, UserID, Extension, DisplayName, Grade, MaxPoints, Points, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
            id,
            req.body.subject,
            req.user.ID,
            ext,
            req.body.name,
            req.body.grade,
            (req.body.maxPoints ? req.body.maxPoints : 0),
            (req.body.points ? req.body.points : 0),
            (req.body.date ? req.body.date : new Date())
        ])

        await scan.mv('/data/' + req.user.ID + "/" + id + "." + ext);
        res.status(200).send({ result: true, message: "Success!"});

    } catch(err) {
        handleServerError(err, res, { path: "/grade", method: "POST" });
    }
});

module.exports = router;