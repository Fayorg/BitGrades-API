const auth = require('../../utils/authMiddleware');
const database = require('../../utils/database');
const crypto = require('crypto');

module.exports = (app) => {

    app.post("/grades/create", auth.authentication, async (req, res) => {

        if(!req.files || Object.keys(req.files).length == 0) { res.status(401).send({ result: false, message: "No files where sent!"}); return; }
        if(!req.body.subject || !req.body.grade || !req.body.name) { res.status(401).send({ result: false, message: "Missing some required fields!"}); return; }

        let scan = req.files.scan;
        let ext = scan.name.split('.')[scan.name.split('.').length - 1];

        if(ext != "pdf") { res.status(401).send({ result: false, message: "This file extension cannot be sent!"}); return; }

        try {

            let id = crypto.randomBytes(32).toString('hex');

            await database.query("INSERT INTO Grades (ID, Subject, UserID, Extension, DisplayName, Grade, MaxPoints, Points, CreatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
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
            return;

        } catch(err) {
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }

    })

}