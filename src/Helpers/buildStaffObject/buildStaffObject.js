const buildStaffObject = (data) =>({
    _id: data._id,
    name: data.name,
    role: data.role,
    baseId: data.baseId,
    firstTime: data.firstTime
});

module.exports = buildStaffObject;