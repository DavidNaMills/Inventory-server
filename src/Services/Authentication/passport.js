const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const logger = require('../Logger/Logger');

const Staff = require('../../Models/staffModel/staffModel');
const config = require('../../config/index');
const buildStaffObject = require('../../Helpers/buildStaffObject/buildStaffObject');


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('authorization'),
    secretOrKey: config.JWT_SECRET
}

const localOptions = {
    usernameField: 'phone',
    passwordField: 'password'
};

passport.serializeUser(function (staff, cb) {
    cb(null, staff._id);
});

passport.deserializeUser(function (id, cb) {
    logger.dev(id);
    db.users.findById(id, function (err, staff) {
        if (err) {
            return cb(err);
        }
        cb(null, staff);
    });
});


const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    logger.dev(payload.sub)
    Staff.findById(payload.sub)
        .then(staff => {
            if (staff) {
                done(null, staff);
            } else {
                done(null, false);
            }
        })
        .catch(err => done(err, false));
})

const localLogin = new LocalStrategy(localOptions, (username, password, done) => {
    Staff.findOne({ phone: username }).then((staff) => {
        if (!staff) {
            logger.warning(`${username}: tried to log in`);
            return done(null, false);
        }
        
        staff.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, staff);
        });

    }).catch((err) => { 
        logger.error(err);
        done(err);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);