module.exports = (theFunc) => (req, res, next) => {
    //Promise is a js class
    Promise.resolve(theFunc(req, res, next)).catch(next);
};
  