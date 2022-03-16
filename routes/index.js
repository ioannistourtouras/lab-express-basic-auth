const router = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const { requireToBeLoggedOut } = require("../middlewares/route-guard")
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.post("/signup", async (req, res, next) => {
  console.log(req.body, "hey, I signed up!")// to see the connection
  const {username, password} = req.body
  const salt = await bcrypt.genSalt(12)
  const hash =  await bcrypt.hash(password, salt)

  const user = {
    username: username,
    password: hash,
  }
  await User.create(user)  
  res.redirect('/login')
});

router.use("/login", requireToBeLoggedOut);
router.get("/login", (req, res) => {
  res.render("login");
})

router.post("/login", async (req, res) => {
  
  try {
    console.log("this is from req.body", req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log(user, "user here");
    const hashFromDb = user.password;
    const passwordCorrect = await bcrypt.compare(req.body.password, hashFromDb);
    console.log(passwordCorrect ? "Yes" : "No");
    if (!passwordCorrect) {
      throw Error("Password incorrect");
    }
    req.session.currentUser = user;// add a property to session obj, declared and initiated
    res.redirect("/profile");
  } catch (err) {
    res.render("login", { error: "Wrong username or password" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return next(err);

    res.redirect("/login");
  });
})

router.get("/profile", (req, res, next) => {
  res.render("profile");
});



module.exports = router;

// npm i connect-mongo