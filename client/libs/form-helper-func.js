// lowercase the string, then remove all white space, and
// lastly, capitalise the first letter
const namifyStr = str => str.toLowerCase().trim().replace(/^\w/, letter => letter.toUpperCase());

// only return numbers in a string
const getOnlyNumbers = str => str.replace(/\D/g, '');

module.exports = { namifyStr, getOnlyNumbers };