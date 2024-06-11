import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js"
import path from 'path';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import Bcrypt from 'bcrypt';
import fetch from 'node-fetch';

const dirname = fs.realpathSync('.');

class PhoneApiBackEndServer {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));

    app.use(express.urlencoded({ extended: false }));
    const authentication = new Authentication(app);

    app.get('/login/', this.login);
    app.post('/login/', passport.authenticate('local', { failureRedirect: '/login' }));

    app.post('/register/', this.doRegister);
    app.post('/logout/', authentication.checkAuthenticated, this.DoLogout);

    app.get('/home/', authentication.checkAuthenticated, this.goHome);
    app.get('/', authentication.checkAuthenticated, this.goHome);

    app.get('/brandLookup/:brand', authentication.checkAuthenticated, this.BrandLookup);
    app.post('/doComment/', authentication.checkAuthenticated, this.doComment);
    app.get('/viewComment/:model', authentication.checkAuthenticated, this.viewComment);

   app.post('/saveProfilePicture', authentication.checkAuthenticated, this.saveProfilePicture);
   app.get('/getProfilePicture', authentication.checkAuthenticated, this.getProfilePicture);

    app.listen(3000, () => console.log('Listening on port 3000'));
  }

  async getProfile(req, res) {
    const userId = req.user.id;
    User.findById(userId, (err, user) => {
      if (err) return res.json({ success: false });
      res.json({ success: true, user: { username: user.username, image: user.image } });
    });
  }

  async UpdateProfile(req, res) {
    const userId = req.user.id;
    const newImageUrl = req.body.imageUrl;
    User.findByIdAndUpdate(userId, { image: newImageUrl }, (err) => {
      if (err) return res.json({ success: false });
      res.json({ success: true });
    });
  }

  async viewComment(req, res) {
    try {
      const model = req.params.model;
      const query = { model: model };
      const collection = db.collection("Comments");
      const stored = await collection.find(query).toArray();
      const response = stored.map(comment => ({
        model: comment.model,
        user: comment.user,
        comment: comment.comment
      }));
      res.json(response);
    } catch (error) {
      console.error('Error retrieving comment:', error);
      res.status(500).json({ success: false, error: 'Failed to retrieve comment' });
    }
  }

  async doComment(req, res) {
    const user = req.user.user;
    const model = req.body.model;
    const comment = req.body.comment;
    const collection = db.collection("Comments");
    const query = { user: user, model: model };
    const update = { $set: { comment: comment } };
    const params = { upsert: true };
    try {
      await collection.updateOne(query, update, params);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ success: false, error: 'Failed to update comment' });
    }
  }

  async BrandLookup(req, res) {
    const API_URL = 'https://www.mockachino.com/a35ab8ac-5d03-48/Phones';
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      let responseToFrontend = null;
      const routeParams = req.params;
      const brand = routeParams.brand;
      if (data.telefonos[0][brand])
        responseToFrontend = data.telefonos[0]
      else if (data.telefonos[1][brand])
        responseToFrontend = data.telefonos[1]
      else if (data.telefonos[2][brand])
        responseToFrontend = data.telefonos[2]
      res.json(responseToFrontend);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('Error fetching data');
    }
  }

  async doRegister(req, res) {
    const key = "Programacion III - AWI";
    const registerUsername = CryptoJS.AES.decrypt(req.body.username, key).toString(CryptoJS.enc.Utf8);
    const registerPassword = CryptoJS.AES.decrypt(req.body.password, key).toString(CryptoJS.enc.Utf8);
    const saltRounds = 10;
    const salt = await Bcrypt.genSalt(saltRounds);
    const hashedRegisterPassword = await Bcrypt.hash(registerPassword, salt);
    const query = { user: registerUsername };
    const update = { $set: { password: hashedRegisterPassword } };
    const params = { upsert: true };
    const collection = db.collection("Users");
    await collection.updateOne(query, update, params);
    res.json({ success: true });
  }

  async login(req, res) {
    res.sendFile(path.join(dirname, "public/login.html"));
  }

  async DoLogout(req, res) {
    req.logout(err => {
      if (err) return res.status(500).json({ error: 'Log-out failed' });
      req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Session destruction failed' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
      });
    });
  }

  async goHome(req, res) {
    res.sendFile(path.join(dirname, "public/home.html"));
  }
  
  async saveProfilePicture(req, res) {
    try {
        const user = req.user.user;
        const { profilePicture } = req.body;
        const collection = db.collection("Users");
        await collection.updateOne({ user: user }, { $set: { profilePicture: profilePicture } }, { upsert: true });
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving profile picture:', error);
        res.status(500).json({ success: false, error: 'Failed to save profile picture' });
    }
 }
 
 
 async getProfilePicture(req, res) {
  try {
      const user = req.user.user;
      const collection = db.collection("Users");
      const profilePictureDoc = await collection.findOne({ user: user });
      if (profilePictureDoc) {
          res.json({ profilePicture: profilePictureDoc.profilePicture, userName: user }); // Incluir el nombre de usuario en la respuesta
      } else {
          res.status(404).json({ error: 'Profile picture not found' });
      }
  } catch (error) {
      console.error('Error fetching profile picture:', error);
      res.status(500).json({ error: 'Failed to fetch profile picture' });
  }
 }
 }
 
 
 new PhoneApiBackEndServer();
 