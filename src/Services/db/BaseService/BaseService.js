const logger = require('../../Logger/Logger');

class BaseService {
    constructor(model) {
        this.model = model;

        this.createRecord = this.createRecord.bind(this);
        this.fetchRecords = this.fetchRecords.bind(this);
        this.countRecords = this.countRecords.bind(this);
        this.updateRecord = this.updateRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
    }

    async createRecord(query) {
        try {
            const item = await this.model(query)
                .save()
                .catch(err => {
                    return {
                        error: true,
                        statusCode: 400,
                        errors: 'dont_know'
                    }
                })

            if (item.error) {
                return item
            }

            if (item) {
                return {
                    error: false,
                    statusCode: 201,
                    item
                }
            } else {
                logger.error('unexpected 500');
                return {
                    error: true,
                    statusCode: 500,
                    errors: 'unexpected'
                }
            }

        } catch (err) {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        }

    }

    // fetchRecords
    async fetchRecords({ query, skip = 0, limit = 0 }) {
        try {
            const data = await this.model
                .find(query)
                .limit(+limit)
                .skip(+skip)
                .catch(err => {
                    logger.warning(err);
                    return {
                        error: true,
                        statusCode: 400,
                        errors: err.errors
                    };
                })

            if (data.error) {
                return data
            }

            return {
                error: false,
                statusCode: 200,
                data
            }


        } catch (err) {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            };
        }
    }


    async countRecords(query) {
        try {
            const count = await this.model.find(query)
                .count()
                .catch(err => {
                    logger.error(err);
                    return {
                        error: true,
                        statusCode: 400,
                        errors: err
                    }
                });

            if (count.error) {
                return count;
            }

            return {
                error: false,
                statusCode: 200,
                count
            }
        } catch (err) {
            logger.error(err);
            return {
                statusCode: 501,
                error: err
            }

        }
    }


    async updateRecord({ id, query }) {
        try {
            const response = await this.model.findByIdAndUpdate(id, { $set: query }, { 'new': true }, (err, item) => {
                if (err) {
                    return {
                        error: true,
                        statusCode: 400,
                        errors: err.errors
                    }
                }
            });

            if (response.error) {
                return response;
            }
            return {
                error: false,
                statusCode: 201,
                item: response
            }
        } catch (err) {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                errors: err
            }
        }
    }


    async deleteRecord(id) {
        try {
            const item = await this.model.findByIdAndDelete(id)
                .catch(err => {
                    logger.error(err);
                    return {
                        error: true,
                        statusCode: 400,
                        deleted: false,
                        errors: err.errors
                    }
                })

            if (item.error) {
                return item;
            }

            return {
                error: false,
                deleted: true,
                statusCode: 200
            }
        } catch (err) {
            logger.error(err);
            return {
                error: true,
                statusCode: 500,
                deleted: false,
                errors: err
            }
        }
    }
}

module.exports = BaseService;