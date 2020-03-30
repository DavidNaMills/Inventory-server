const arrayToObject = (array, field='_id') =>{
    const temp = {};
    array.forEach(x=>temp[x[field]] = x)
    return temp
}

module.exports = arrayToObject;