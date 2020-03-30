const typeController = require('../../Controllers/TypesController/TypesController');
require('../../Services/Authentication/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: true });
const isSubAdmin = require('../../Middleware/isSubAdmin/isSubAdmin');


module.exports = (app) => {
    app.get('/allTypes',
        // requireAuth,
        typeController.fetchAllTypes
    );

    app.get('/types/:which',
        requireAuth,
        typeController.fetchSpecificType
    );

    app.post('/types/:which',
        requireAuth,
        isSubAdmin,
        typeController.createNewType
    );

    app.put('/types/:id',
        requireAuth,
        isSubAdmin,
        typeController.updateType
    )
    
}