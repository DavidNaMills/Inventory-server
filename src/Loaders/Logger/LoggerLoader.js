const consoleConfig = require('../../config/Logger/consoleConfig');
const logger = require('../../Services/Logger/Logger');
const config = require('../../config/index');

logger.configLogger({
    methods: [consoleConfig],
    level: config.LOGGER_LEVEL
})
