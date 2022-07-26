function handleNoItemFoundError(res) {

    res.status(404).send({ result: false, message: "Nothing found for provided arguments!", errorCode: 101 });

}

module.exports = handleNoItemFoundError;