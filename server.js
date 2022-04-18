const express = require('express');
const fileUpload = require('express-fileupload')
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true
}));

require('./routes/configuration')(app);
require('./routes/subject')(app);
require('./routes/grades/create')(app);
require('./routes/grades/index')(app);
require('./routes/grades/get')(app);

app.listen(process.env.PORT || 3000, () => { console.log("BitGrades API running on port " + (process.env.PORT || 3000)) });