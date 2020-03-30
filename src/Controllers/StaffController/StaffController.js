const StaffService = require('../../Services/db/StaffService/StaffService');
const Staff = require('../../Models/staffModel/staffModel');
const logger = require('../../Services/Logger/Logger');
const sanitize = require('../../Helpers/sanitizeUserPassword/sanitizeUserPassword');
const encrypt = require('../../Helpers/encrypt/encrypt');

const staffService = new StaffService(Staff);

class StaffController {
    constructor(service){
        this.service = service;

        this.fetchAllStaff = this.fetchAllStaff.bind(this);
        this.addNewStaff = this.addNewStaff.bind(this);
        this.removeStaff = this.removeStaff.bind(this);
        this.updateStaff = this.updateStaff.bind(this);
        this.blockStaff = this.blockStaff.bind(this);
        this.fetchAllLocationsStaff = this.fetchAllLocationsStaff.bind(this);
    }

    async fetchAllStaff(req, res){
        const response = await this.service.fetchRecords({query: req.body})
        .catch(err=>{
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });

        if(response.error){
            return res.status(response.statusCode).json(response);
        }

        return res.status(response.statusCode).json({
            ...response,
            data : sanitize(response.data)
        });
    }


    async fetchAllLocationsStaff(req, res){
        const loc = req.params.location;
        const response = await this.service.fetchRecords({query: {baseId : loc}})
        .catch(err=>{
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });

        if(response.error){
            return res.status(response.statusCode).json(response);
        }

        return res.status(response.statusCode).json({
            ...response,
            data : sanitize(response.data)
        });
    }


    async addNewStaff(req, res){
        const exists = await this.service.fetchRecords({query: {phone: req.body.phone}});

        if(exists.data.length>0){
            logger.error(exists.data.length);
            return res.status(400).json({
                error: true,
                statusCode: 400,
                errors: {
                    message: 'userExists'
                }
            });
        }

        const fixed = {
            ...req.body,
            baseId: Array.isArray(req.body.baseId) ? req.body.baseId : [req.body.baseId]
        }

        const response = await this.service.createRecord(req.body)
        .catch(err=>{
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });
        if(response.error){
            logger.error(response);
            return res.status(response.statusCode).json(response);
        }
        logger.info(response)
        return res.status(response.statusCode).json({
            ...response,
            item: sanitize(response.item)
        });
    }



    async removeStaff(req, res){
        const {id} = req.params;
        const response = await this.service.deleteRecord(id)
        .catch(err=>{
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });

        return res.status(response.statusCode).json(response);
    }


    async blockStaff(req, res){
        const {id, block} = req.params;
        const response = await this.service.updateRecord({
            id,
            query: {isBlocked: block}
        })
        .catch(err=>{
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        });
        return res.status(response.statusCode).json(response);
    }


    async updateStaff(req, res){
        const {id} = req.params;
        const query = req.body;

        if(req.body.password){
            const temp = await encrypt(req.body.password);
            query.password = temp; 
        }

        const response = await this.service.updateRecord({
            id,
            query
        })
        .catch(err=>{
            return {
                error: true,
                statusCode: 500,
                upPass: req.body.password ? true : false,
                errors: err
            };
        });

        return res.status(response.statusCode).json(response);
    }
}

module.exports = new StaffController(staffService);