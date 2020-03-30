const TypeService = require('../../Services/db/TypeService/TypeService');
const Types = require('../../Models/typesModel/typesModel');
const logger = require('../../Services/Logger/Logger');
const toObj = require('../../Helpers/arrayToObject/arrayToObject');
const {whichType} = require('../../consts/allTypes');

const typeService = new TypeService(Types);

class TypesController {
    constructor(service) {
        this.service = service;

        this.fetchAllTypes = this.fetchAllTypes.bind(this);
        this.fetchSpecificType = this.fetchSpecificType.bind(this);
        this.createNewType = this.createNewType.bind(this);
        this.updateType = this.updateType.bind(this);
    }

    async fetchAllTypes(req, res) {
        const response = await this.service.fetchRecords({ query: {} })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    errors: err
                };
            })

        
        // const data = toObj(response.data);
        return res.status(response.statusCode).json({
            ...response,
            data:{
                locations: toObj(response.data.filter(x=>x.which==='LOCATIONS')),
                products: toObj(response.data.filter(x=>x.which==='PRODUCTS'))
            }
        });
    }


    async fetchSpecificType(req, res) {
        const { which } = req.params;

        if(!whichType[which]){
            return res.status(500).json({error: 'nonExistant'});
        }

        const response = await this.service.fetchRecords({ query: { which } })
            .catch(err => {
                logger.error(err);
                return {
                    error: true,
                    statusCode: 500,
                    errors: err
                };
            });

        const data = toObj(response.data);
        return res.status(response.statusCode).json({
            ...response,
            data
        });
    }


    async createNewType(req, res){
        const {which} = req.params;

        if(!whichType[which]){
            return res.status(500).json({error: true, errors: 'nonExistant'});
        }

        const response = await this.service.createRecord({
            ...req.body,
            which
        })
        .catch(err => {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });

        return res.status(response.statusCode).json(response);
    }


    async updateType(req, res){
        const {id} = req.params;
        const response = await this.service.updateRecord({
            id,
            query: req.body
        }).catch(err => {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });

        return res.status(response.statusCode).json(response);
    }

}

module.exports = new TypesController(typeService);