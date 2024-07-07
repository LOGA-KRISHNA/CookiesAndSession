import express, { query } from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";

const app = express();
const port = 4000;
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "2004",
  port: 5432,
});
db.connect();
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register",async(res,req)=>{
  const email=req.body.username;
  const password=req.body.password;

  try{
    const checkRow=await db.query("select * from users where email=$1",[email]);
    if(checkRow.rows.length>0){
        req.redirect("login.ejs");
    }else{
      bcrypt.hash(password,saltRounds,(err,hash)=>{
        if(err) console.log(err);
        else{
          await db.query()
        }
      })
    }
  }
  catch{

  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const loginPassword = req.body.password;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
        } else {
          if (result) {
            res.render("secrets.ejs");
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
