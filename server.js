import express from 'express';
import db from './db.js';
import passport from 'passport';
import Authentication from "./auth.js"
import path from 'path';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import Bcrypt from 'bcrypt';
import fetch from 'node-fetch'; //ERNESTO: libreria requerida para poder hacer el fetch

const dirname = fs.realpathSync('.');

class DictionaryBackendServer {
  constructor() {
    const app = express();
    app.use(express.json());
    app.use(express.static('public'));

    app.use(express.urlencoded({extended: false}));
    const authentication = new Authentication(app);

  //  app.get('/lookup/:word',authentication.checkAuthenticated, this.doLookup); 
  //  app.post('/save/', authentication.checkAuthenticated,this.doSave);
  //  app.delete('/delete/',authentication.checkAuthenticated, this.doDelete);

    app.get('/login/', this.login);
    app.post('/login/', passport.authenticate('local', {failureRedirect: '/login'}));

    app.post('/register/', this.doRegister);
    app.post('/logout/', authentication.checkAuthenticated, this.DoLogout);

    app.get('/home/', authentication.checkAuthenticated, this.goHome); 
    app.get('/', authentication.checkAuthenticated, this.goHome);     
    
    app.get('/brandLookup/:brand', authentication.checkAuthenticated, this.BrandLookup); //ERNESTO: este endpoint permite retorna los celulares de una marca
    
    
    app.listen(3000, () => console.log('Listening on port 3000'));    
  }

  

  async BrandLookup(req,res){
    const API_URL = 'https://www.mockachino.com/a35ab8ac-5d03-48/Phones'; 
    try {
        const response = await fetch(API_URL); // ERNESTO: obtenemos la informacion de la API mockeada
        const data = await response.json();

        let responseToFrontend = null;
        const routeParams = req.params;
        const brand = routeParams.brand; // ERNESTO: obtenemos la marca enviada como parametro desde el frontend

        // ERNESTO: procesamos la información obtendia de la API para quedarnos unicamente con la correspondiente a la marca
        if (data.telefonos[0][brand])
          responseToFrontend = data.telefonos[0]
        else
          if (data.telefonos[1][brand])
            responseToFrontend = data.telefonos[1]
          else
            if (data.telefonos[2][brand])
              responseToFrontend = data.telefonos[2]

        res.json(responseToFrontend); // ERNESTO: enviamos la información procesada hacia el frontend

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }   
  }

  async doRegister(req, res) {
    console.log("The encrypted username is: " + req.body.username)
    console.log("The encrypted password is: " + req.body.password)

    const key = "Programacion III - AWI";
    const registerUsername = CryptoJS.AES.decrypt(req.body.username, key).toString(CryptoJS.enc.Utf8);
    const registerPassword = CryptoJS.AES.decrypt(req.body.password, key).toString(CryptoJS.enc.Utf8);

    console.log("The username is: " + registerUsername)
    console.log("The password is: " + registerPassword)

    const saltRounds = 10;
    const salt = await Bcrypt.genSalt(saltRounds);
    const hashedRegisterPassword = await Bcrypt.hash(registerPassword, salt);

    const query = { user: registerUsername};
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
      if (err) {
        return res.status(500).json({ error: 'Log-out failed' });
      }
      req.session.destroy(err => {
        if (err) {
          return res.status(500).json({ error: 'Session destruction failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
      });
    });
  }

  async goHome(req, res) {
    res.sendFile(path.join(dirname, "public/home.html"));
  }
  
  /*
  async doLookup(req, res) {
   const word = req.params.word.toLowerCase();
   const query = { word: word };
   const collection = db.collection("dict");
   const stored = await collection.findOne(query);
   const response = {
     word: word,
     definition: stored ? stored.definition : ''
   };
   res.json(response);
  }

  async doSave(req, res) {
    const word = req.body.word.toLowerCase();
    const query = { word: word };
    const update = { $set: { definition: req.body.definition } };
    const params = { upsert: true };
    const collection = db.collection("dict");
    await collection.updateOne(query, update, params);
    res.json({ success: true });
  }

  async doDelete(req, res) {
    const word = req.body.word.toLowerCase();
    const query = { word: word };
    const collection = db.collection("dict");
    const deleted = await collection.findOneAndDelete(query);
    res.json(deleted.value);
  }
  */
}

new DictionaryBackendServer();