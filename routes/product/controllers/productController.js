let Product = require("../models/Product");
let paginate = require("../utils/pagination");
module.exports = {
  getAllProducts: params => {
    return new Promise((resolve, reject) => {
      Product.find(params).then(products => {
        resolve(products);
      });
    }).catch(error => {
      let errors = {};
      errors.status = 500;
      errors.message = error;

      reject(errors);
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
  },
  getPageIfUserLoggedIn: (req, res, next) => {
    if (req.user) paginate(req, res, next);
    else res.render("index");
  },
  searchProductByQuery: function(req, res) {
    if (req.query.q) {
      Product.search(
        {
          query_string: {
            query: req.query.q
          }
        },
        (err, results) => {
          if (err) {
            let errors = {};
            errors.status = 500;
            errors.message = err;
            res.status(errors.status).json(errors);
          } else {
            let data = results.hits.hits;
            res.render("search/search-results", {
              products: data,
              query: req.query.q
            });
          }
        }
      );
    }
  },
  instantSearch: function(req, res) {
    console.log(req.body.search_term)
      Product.search({
      query_string:{
        query: req.body.search_term
      } 
    },
        (err, result) => {
          if (err) {
            let errors = {};
            errors.status = 500;
            errors.message = err;
            res.status(errors.status).json(errors);
          } else {
            res.json(result);
          }
        });
    
  }
};
