module.exports = () =>
  Math.floor((1 + Math.random()) * 0x100000000000)
    .toString(16)
    .substring(1);
