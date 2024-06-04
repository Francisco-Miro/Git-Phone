import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import db from './db.js';
import CryptoJS from 'crypto-js';
import Bcrypt from 'bcrypt';

class Authentication {
    constructor(app) {
        app.use(session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        }));

        app.use(passport.initialize()); // init passport on every route call
        app.use(passport.session());
        passport.use(new LocalStrategy(this.verifyIdentity));

        passport.serializeUser((user, done) => done(null, user));
        passport.deserializeUser((user, done) => done(null, user));
    }

   async verifyIdentity(username, password, done) {

    const key = "Programacion III - AWI";
    const user = CryptoJS.AES.decrypt(username, key).toString(CryptoJS.enc.Utf8);
    const pass = CryptoJS.AES.decrypt(password, key).toString(CryptoJS.enc.Utf8);

    console.log("Decrypted Username:", user);
    console.log("Decrypted Password:", pass);

    const collection = db.collection("Users");
    const query = {user:user};
    const userFromDB = await collection.findOne(query);



        if (!userFromDB) {
            return done(new Error('Wrong User'));
        }
        const isMatch = await Bcrypt.compare(pass, userFromDB.password);
        if (!isMatch) {
            return done(new Error('Invalid password or password'));}
        console.log("Login OK");
        return done(null, userFromDB);
        }
    

    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { 
            return next(); 
        }
        res.redirect("/login");
    }

}

export default Authentication;
