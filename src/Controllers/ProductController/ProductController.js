const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Product = require('../../Models/productModel/productModel');
const ProductService = require('../../Services/db/ProductService/ProductService');
const logger = require('../../Services/Logger/Logger');
const config = require('../../config/index');

const productService = new ProductService(Product);


const storage = multer.diskStorage({
    destination: config.FILE_DESTINATION,
    filename: function (req, file, cb) {
        logger.info('inside filename');
        logger.info(file);

        if (file) {
            logger.info(file)
            cb(null, `${Date.now()}${file.originalname}`);
        } else {
            logger.error('no file')
            cb(null);
        }
    }
});

const upload = multer({ storage }).single('image');



class ProductController {
    constructor(service) {
        this.service = service;

        this.fetchProducts = this.fetchProducts.bind(this);
        this.fetchProductsLocation = this.fetchProductsLocation.bind(this);
        this.createNewProduct = this.createNewProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.fetchProductsTypes = this.fetchProductsTypes.bind(this);
    }

    async fetchProducts(req, res) {
        const { skip, limit } = req.params;

        const response = await this.service.fetchRecords({
            query: {},
            skip,
            limit
        }).catch(err => {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        });

        const count = await this.service.countRecords({})
            .catch(err => {
                return {
                    error: true,
                    statusCode: 400,
                    errors: err
                }
            });

        return Promise.all([response, count])
            .then(results => {
                if (results[0].error) {
                    return res.status(400).json({
                        error: true,
                        errors: results[0].errors,
                        statusCode: 400
                    });
                }

                if (results[1].error) {
                    return res.status(400).json({
                        error: true,
                        errors: err,
                        statusCode: 400
                    });
                }

                return res.status(200).json({
                    products: results[0].data,
                    count: results[1].count
                });

            })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    deleted: false,
                    errors: err
                }
            })
    }


    async createNewProduct(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    errors: 'file_upload'
                });
            }

            const exists = await this.service.fetchRecords({ query: { code: req.body.code } });
            
            if (exists.data.length > 0) {
                if(req.file){
                    fs.unlinkSync(req.file.path);
                }
                return res.status(400).json({
                    error: true,
                    statusCode: 400,
                    errors: 'codeExists'
                });
            }

            const response = await this.service.createRecord({
                ...req.body,
                url: req.file ? req.file.filename : null
            })
                .catch(err => {
                    logger.error('err');
                    return {
                        statusCode: 400,
                        error: true,
                        errors: err
                    }
                });

            return res.status(response.statusCode).json(response);
        })
    }


    async deleteProduct(req, res) {
        const { id } = req.params;

        // TODO: find the file first and remove file
        const response = await this.service.deleteRecord(id)
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    deleted: false,
                    errors: err
                }
            })

        return res.status(response.statusCode).json(response);
    }


    updateProduct(req, res) {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    errors: ''
                });
            }
            const { id } = req.params;

            const query = req.file
                ? {
                    ...req.body,
                    url: req.file.filename
                }
                : req.body


            delete query._id;
            delete query.__v;

            if (req.body.code) {
                const exists = await this.service.fetchRecords({ query: { code: req.body.code } });
                if (exists.data.length > 0) {
                    logger.error(exists.data.length);
                    return res.status(400).json({
                        error: true,
                        statusCode: 400,
                        errors: 'codeExists'
                    });
                }
            }

            if(req.file){
                const checkFile = await this.service.fetchRecords({ query: { _id: id } });
                if(checkFile.data[0].url){
                    logger.info('removing a file for update');
                    try{
                        fs.unlinkSync(path.join(config.FILE_DESTINATION, checkFile.data[0].url));
                    } catch(fileErr){
                        logger.error(fileErr);
                    }
                }
            }

            try {
                this.service.updateRecord({
                    id,
                    query
                })
                    .then(response => {
                        return res.status(response.statusCode).json(response);
                    })
                    .catch(err => {
                        return {
                            error: true,
                            statusCode: 500,
                            deleted: false,
                            errors: err
                        }
                    })

            } catch (err) {
                logger.error(err)
            }
        })
    }





    async fetchProductsLocation(req, res) {
        const { location, skip, limit } = req.params;

        const response = await this.service.fetchRecords({
            query: { locId: location },
            skip,
            limit
        })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 400,
                    errors: err
                }
            });

        const count = await this.service.countRecords({ locId: location })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 400,
                    errors: err
                }
            })

        Promise.all([response, count])
            .then(results => {
                if (results[0].error) {
                    return res.status(400).json({
                        error: true,
                        errors: results[0].errors,
                        statusCode: 400
                    });
                }

                if (results[1].error) {
                    return res.status(400).json({
                        error: true,
                        errors: err,
                        statusCode: 400
                    });
                }

                return res.status(200).json({
                    products: results[0].data,
                    count: results[1].count
                });

            })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    deleted: false,
                    errors: err
                }
            })
    }


    async fetchProductsTypes(req, res) {
        const { typeId } = req.params;
        logger.dev(`[fetchProductsTypes] ${typeId}`);

        const response = await this.service.fetchRecords({
            query: { type: typeId }
        })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 400,
                    errors: err
                }
            });

        const count = await this.service.countRecords({ type: typeId })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 400,
                    errors: err
                }
            })

        Promise.all([response, count])
            .then(results => {
                if (results[0].error) {
                    return res.status(400).json({
                        error: true,
                        errors: results[0].errors,
                        statusCode: 400
                    });
                }

                if (results[1].error) {
                    return res.status(400).json({
                        error: true,
                        errors: err,
                        statusCode: 400
                    });
                }

                return res.status(200).json({
                    products: results[0].data,
                    count: results[1].count
                });

            })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    deleted: false,
                    errors: err
                }
            })
    }
}

module.exports = new ProductController(productService);