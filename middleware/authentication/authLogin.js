import { getHash } from "./getHash";

// Login middleware/ or maybe not to be used to authenticate or redirect with error
export function checkPassword (req, res, next) {
  const {userName, password} = req.body;
  
}