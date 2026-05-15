const cleanHtml = (str) => str.replace(/(<([^>]+)>)/gi, '').trim();
const dateToISO = (date) => new Date(date).toISOString();
const isObjIncludeKey = (obj, key) => Object.keys(obj).includes(key);

export { cleanHtml, dateToISO, isObjIncludeKey };
