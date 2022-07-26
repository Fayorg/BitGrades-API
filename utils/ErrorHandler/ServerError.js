function handleServerError(err) {

    console.info("[Error-Handler] New error incoming!");
    console.error(err);

}

function handleServerError(err, jsonMessage) {

    console.info("[Error-Handler] New error incoming!");
    console.error(err);
    console.info("[Error-Handler] Additionnal : " + jsonMessage.toString());

}

function handleServerError(err, res) {

    console.info("[Error-Handler] New error incoming!");
    console.error(err);
    res.status(500).send({ result: false, message: "Something went wrong! Please try again.", errorCode: 101 });

}

function handleServerError(err, res, jsonMessage) {

    console.info("[Error-Handler] New error incoming!");
    console.error(err);
    console.info("[Error-Handler] Additionnal : " + jsonMessage.toString());
    res.status(500).send({ result: false, message: "Something went wrong! Please try again.", errorCode: 101 });

}

module.exports = handleServerError;