
const sanitizeUserPassword = (data, field = 'password') => {
    if (Array.isArray(data)) {
        return data.map(x => {
            const t = JSON.parse(JSON.stringify(x));
            delete t[field];
            return t;
        })
    }
    if (Object.keys(data).length > 0) {
        const t = JSON.parse(JSON.stringify(data));
        delete t[field];
        return t;
    }
}

module.exports = sanitizeUserPassword;