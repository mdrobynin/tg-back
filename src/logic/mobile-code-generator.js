module.exports = function () {
    return [...new Array(6)].map(() => Math.floor(Math.random() * 10)).join('');
}