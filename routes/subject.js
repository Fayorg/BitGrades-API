const auth = require('../utils/authMiddleware');
const database = require('../utils/database');

module.exports = (app) => {

    app.get("/subject", auth.authentication, async (req, res) => {

        try{
            // Query user to find configuration
            let user = await database.query("SELECT * FROM Options WHERE ID = ?", [req.user.ID]);

            // Query all user's subject
            let subject = await database.query("SELECT ID, Name FROM Subjects WHERE IsAlways = true AND year = ? OR Os = ? OR L2 = ? OR L3 = ? OR OAC = ? OR Mat = ?", [user[0].Year, user[0].Os, user[0].L2, user[0].L3, user[0].OAC, user[0].Mat]);

            res.status(200).send({ result: true, message: "Success!", value: (subject.filter(value => value.ID != null)) });
            return;
        } catch(err) {
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }
    })

}