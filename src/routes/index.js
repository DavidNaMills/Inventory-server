module.exports = (app) => {
    require('./accessRoutes/accessRoutes')(app);
    require('./productRoutes/productRoutes')(app);
    require('./staffRoutes/staffRoutes')(app);
    require('./typesRoutes/typesRoutes')(app);
}