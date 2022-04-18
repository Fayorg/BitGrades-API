const auth = require('../utils/authMiddleware');
const database = require('../utils/database');

module.exports = (app) => {

    app.post("/configuration", auth.authentication, async (req, res) => {

        // Check if all fields has been filled
        if(!req.body.year || !req.body.OS || !req.body.L2 || !req.body.L3 || !req.body.OAC || !req.body.MAT) { res.status(401).send({ result: false, message: "You need to fill all fields!"}); return; }

        // Check if all the value are possible
        if(req.body.year <= 0 || req.body.year >= 4) { res.status(401).send({ result: false, message: "Year cannot be less than 1 or more than 3"}); return; }
        if(req.body.OS <= 0 || req.body.OS >= 6) { res.status(401).send({ result: false, message: "OS cannot be less than 1 or more than 5"}); return; }
        if(req.body.L2 <= 0 || req.body.L2 >= 4) { res.status(401).send({ result: false, message: "L2 cannot be less than 1 or more than 3"}); return; }
        if(req.body.OAC <= 0 || req.body.year >= 3) { res.status(401).send({ result: false, message: "OAC cannot be less than 1 or more than 2"}); return; }
        if(req.body.MAT < 0 || req.body.year >= 2) { res.status(401).send({ result: false, message: "Maths cannot be less than 0 or more than 1"}); return; }
        if(req.body.L3 <= 0 || req.body.L3 >= 2) { res.status(401).send({ result: false, message: "L3 cannot be less than 1 or more than 1"}); return; }

        try {
            // Enter value into the database
            await database.query("INSERT INTO Options (ID, Os, L2, L3, OAC, Year, Mat) VALUES (?, ?, ?, ?, ?, ?, ?)", [req.user.ID, req.body.OS, req.body.L2, req.body.L3, req.body.OAC, req.body.year, req.body.MAT])
            
            res.status(200).send({ result: true, message: "Configuration applied!"});
            return;
        } catch(err) {
            res.status(500).send({ result: false, message: "Something went wrong, Please try again! If this happen again, please contact BitGrades support!"}); 
            return;
        }
    })

}