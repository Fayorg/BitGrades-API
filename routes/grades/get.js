const auth = require('../../utils/authMiddleware');
const database = require('../../utils/database');

module.exports = (app) => {

    app.get("/grades/get/*", auth.authentication, async (req, res) => {

        if(!req.url.replace("/grades/get/", "")) { res.status(401).send({ result: false, message: "You need to provide a test ID!"}); return; }

        try {
            let grades = await database.query("SELECT Grades.ID, Subjects.Name, Grades.DisplayName, Grades.Grade, Grades.MaxPoints, Grades.Points, Grades.CreatedAt FROM Grades INNER JOIN Subjects ON Grades.Subject=Subjects.ID WHERE Grades.UserID = ? AND Grades.ID = ?", [req.user.ID, req.url.replace("/grades/get/", "")]);

            if(grades[0] == null) { res.status(500).send({ result: false, message: "This ID cannot be found!"}); return; }

            res.status(200).send({ result: true, message: "Success!", value: (grades[0]) });
            return;
        } catch(err) {
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }

    })

}