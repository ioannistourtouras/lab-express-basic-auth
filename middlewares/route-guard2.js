const allowedToSeeMainFunnyCat = (req, res, next) => {
    if (!req.session.currentUser) {
      res.redirect("/login");
      return;
    }
  
    next();
  };

  const notAllowedToSeeMainFunnyCat = (req, res, next) => {
    if (req.session.currentUser) {
      res.render("/main");
      return;
    }
  
    next();
  };

  const objectToExport = {
    allowedToSeeMainFunnyCat,
    notAllowedToSeeMainFunnyCat,
  };



  module.exports = objectToExport;