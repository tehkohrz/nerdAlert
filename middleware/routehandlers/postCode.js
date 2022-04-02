import { v4 as uuidv4 } from 'uuid';
import { escapeSpecials, returnSpecials } from '../../scripts/escapeSpecials.js';

// POST Handler for posting code into the DB

export function postCode (req, res) {
    const codeData = req.body.codeSaver;
    const codeId = uuidv4();
    // const codeId = req.body.codeId;
    const data = { codeData, codeId };
    const escapedData = escapeSpecials(codeData);
    console.log(data);
    const returnedData = returnSpecials(escapedData)
    console.log('Esc Data: ', escapedData);
    console.log('Ret Data:', returnedData);
    res.render('main',{codeData: returnedData} )
}
