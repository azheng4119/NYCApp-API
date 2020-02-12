var express = require('express');
var router = express.Router();

const trainsRouter = require("./trains");

router.use("/trains", trainsRouter);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
