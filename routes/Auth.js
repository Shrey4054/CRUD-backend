const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");



const redirectLink = "/nav/nav.html" 


async function encrypt(password) {
  return await bcrypt.hash(password, 13);
}

router.get("/action", (req, res) => {
  res.status(200).send("Hello from Auth");
});


//register
router.post("/action/register", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password;

   if (!email || !password) {
    return res.status(400).send("Bad input, no email or password.");
  }

  const userExist = await pool.query("SELECT email FROM users WHERE email = $1", [
    email
  ]);
 
  if (userExist.rows.length > 0) {
    return res.status(409).send(`User already exist with email: ${email}`);
  } else {
    try {
      const encrypted = await encrypt(password);

      await pool.query(
        "INSERT INTO users (email,password_hash) VALUES ($1,$2)",
        [email, encrypted]
      );
   
      const idResult = await pool.query("SELECT id FROM users where email = $1", [email])

     const id = await idResult.rows[0].id
      req.session.user = {id : id, email : email}
      return res.status(200).send({link: redirectLink})
    } catch (err) {
      console.error(err);
      return res.status(500).send("Server error");
    }
  }
});
//login
router.post("/action", async (req, res) => {
  const email = req.body.email?.trim().toLowerCase()
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send("Bad input, no email or password.");
  }

  try {
    const result = await pool.query(
      "SELECT password_hash,id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("No Email or Password found, create an account?");
    }

    const hash = result.rows[0].password_hash;
    const isMatch = await bcrypt.compare(password, hash);
    const id = await result.rows[0].id
    

    if (!isMatch) {
      return res.status(401).send("Incorrect Password");
    }
    
    
    req.session.user = {id : id, email : email}
    console.log(req.session.user)
    return res.status(200).send({link: redirectLink})
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});






module.exports = router;
