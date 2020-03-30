const logger = require('../../Services/Logger/Logger');
const express = require('express');
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const routes = require('../../routes/index');
const bodyParser = require('body-parser');

const fs = require('fs');

module.exports = ({ app }) => {
    app.use(passport.initialize());
    app.use(passport.session());
    app.enable('trust proxy');
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    routes(app);

    /**
     * Health-check endpoints
     */
    app.use(express.static(path.join(global.__basedir, '/public')));
    app.get('/status', (req, res) => {
        logger.info('/status endpoint health-check hit');
        return res.status(200).send('Aint nothing wrong here!');
    })

    app.get('*', (req, res)=>{
        // log visitor
        
        // fs.readdirSync('/public').forEach(file => {
        //     console.log(file);
        //   });

        //   if (fs.existsSync('/public/index.html')) {
        //     console.log('file exists');
        // } else {
        //     console.log('index doesnt exist');
        // }
        
        // res.sendFile(path.join('/public', 'index.html'));
        res.sendFile(path.join(__basedir, 'public', 'index.html'));
    });
}