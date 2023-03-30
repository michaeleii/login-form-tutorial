const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const db = require("./userDb");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

// Initialize Express Session
app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: true,
	})
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Local Strategy
passport.use(
	new LocalStrategy((username, password, done) => {
		const user = db.getUserByUsername(username);
		if (!user) {
			return done(null, false, { message: "Incorrect username" });
		} else if (user.password !== password) {
			return done(null, false, { message: "Incorrect password" });
		}
		return done(null, user);
	})
);

// Serialize User
passport.serializeUser((user, done) => {
	done(null, user.id);
});

// Deserialize User
passport.deserializeUser((id, done) => {
	const user = db.getUserById(id);
	if (user) {
		done(null, user);
	} else {
		done(null, false, { message: "User not found" });
	}
});

app.use((req, res, next) => {
	res.locals.currentLoggedInUser = req.user;
	next();
});

app.get("/", (req, res) => {
	// Pass the current logged in user to the index.ejs file
	res.render("index");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
	})
);

app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/");
});

app.listen(3000, () => {
	console.log("Login App listening on port 3000!");
});
