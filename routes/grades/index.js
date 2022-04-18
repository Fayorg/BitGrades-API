const auth = require('../../utils/authMiddleware');
const database = require('../../utils/database');

module.exports = (app) => {

    app.get("/grades", auth.authentication, async (req, res) => {

        try {
            let grades = await database.query("SELECT Grades.ID, Subjects.Name, Grades.DisplayName, Grades.Grade, Grades.MaxPoints, Grades.Points, Grades.CreatedAt FROM Grades INNER JOIN Subjects ON Grades.Subject=Subjects.ID WHERE Grades.UserID = ?", [req.user.ID]);
            res.status(200).send({ result: true, message: "Success!", value: (grades.filter(grade => grade.ID != null)) });
            return;
        } catch(err) {
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }

    })

}