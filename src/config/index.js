const path = require('path');

module.exports = {
    PORT: process.env.PORT || 7000,
    SIGNATURE: process.env.SIGNATURE || 'H1gHperF0rM4Nc3Gi113teendURAnc3c0Olw4v3',
    URI : process.env.URI || "mongodb://localhost/inventory",
    // URI: ,
    LOGGER_URI: process.env.LOGGER_URI || "mongodb://localhost/logger",
    LOGGER_LEVEL: process.env.LOGGER_LEVEL || 4,
    FILE_DESTINATION: path.join(global.__basedir, '/public','/productImages/'),
    JWT_SECRET: process.env.JWT_SECRET || '2df3sg4df53sgf4d53sg4df53sg4fd53g4fd53sg4df564gdf56s4gf56ds',

    SU_ADMIN: process.env.SU_ADMIN_USER || 'testtest',
    SU_ADMINP: process.env.SU_ADMIN_PASS || 'testtest',
    WHICH: process.env.NODE_ENV || 'Development'
}