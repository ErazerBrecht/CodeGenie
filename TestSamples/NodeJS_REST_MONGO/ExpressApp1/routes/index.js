var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'CodeGenie' });
    
});

router.get('/questions', function (req, res) {
    var db = req.db;
    var collection = db.get('questions');
    collection.find({}, {}, function (e, docs) {
        res.json(docs);
    });
});

router.get('/questions/:id', function (req, res) {
    var db = req.db;
    db.get('questions').find({ _id : req.params.id }, function(err, result) {
        if (err) {
            res.send("Didn't found that question");
        } 
        else {
            res.json(result);
        }
    });
});

module.exports = router;
