import uuid from 'uuid';

// POST Handler for posting code into the DB

function postCode (req, res) {
    const codeData = req.body.codeSaver;
    const codeId = uuid()
}