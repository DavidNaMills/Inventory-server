

module.exports = (app) => {
    app.post('/stocktake');

    // get a specific stocktake OR the latest one. also return all the dates of previous stock takes
    app.get('stocktake/:id');
}