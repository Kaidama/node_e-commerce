var express = require("express");
var router = express.Router();
const paginate = require("./product/utils/pagination");
let productController = require("./product/controllers/productController");

/* GET home page. */
router.get("/", productController.getPageIfUserLoggedIn);
router.get("/page/:page", paginate);
router.get("/test", (req, res) => {
  res.render("test");
});

router.post("/testJquery", (req, res) => {
  console.log(req.body);
  res.send({ result: "success" });
});

module.exports = router;
