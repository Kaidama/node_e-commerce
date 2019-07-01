let Product = require("../models/Product");

module.exports = {
  getAllProducts: (req, res, next) => {

    return new Promise((resolve, reject) => {
      const perPage = 9
      const page = req.params.page || 1
  
      Product.find({ })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, products) {
          Product.count().exec(function(err, count) {
            if (err) return next(err);
            res.render("index", {
              products: products,
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        })
        .then(products => {
          resolve(products);
        })
        .catch(error => {
          let errors = {};
          errors.status = 500;
          errors.message = error;

          reject(errors);
        });
    });
  },
  getProductByID: id => {
    return new Promise((resolve, reject) => {
      Product.findById(id)
        .then(product => {
          resolve(product);
        })
        .catch(error => {
          let errors = {};
          errors.status = 500;
          errors.message = error;

          reject(errors);
        });
    });
  },
  getProductsByCategoryID: id => {
    return new Promise((resolve, reject) => {
      Product.find({ category: id })
        .populate("category")
        .exec()
        .then(products => {
          resolve(products);
        })
        .catch(error => {
          let errors = {};
          errors.status = 500;
          errors.message = error;

          reject(errors);
        });
    });
  }
};
