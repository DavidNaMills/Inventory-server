require('../../Services/Authentication/passport');
const isSubAdmin = require('../../Middleware/isSubAdmin/isSubAdmin');
const isAdmin = require('../../Middleware/isAdmin/isAdmin');
const productController = require('../../Controllers/ProductController/ProductController');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', { session: true });


module.exports = (app) => {
    // app.post('/product/:hasImage',
    app.post('/product',
        requireAuth,
        isSubAdmin,
        productController.createNewProduct
    );

    app.get('/allProducts/:location/:skip/:limit',
        requireAuth,
        productController.fetchProductsLocation
    );

    app.get('/fetchProductTypes/:typeId',
        requireAuth,
        productController.fetchProductsTypes
    );

    app.get('/adminProducts/:skip/:limit',
        // devLogger,
        requireAuth,
        isAdmin,
        productController.fetchProducts
    );

    app.put('/product/:id/',
        requireAuth,
        isSubAdmin,
        productController.updateProduct
    );

    app.delete('/product/:id',
        requireAuth,
        isAdmin,
        productController.deleteProduct
    );



    // app.get('/adminProductsStock/:location');
    // app.post('/allProductsStockTake/:location');

}