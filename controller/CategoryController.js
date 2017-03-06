const Category = require('../model/category');
const Item = require('../model/item');
const async = require('async');
const httpcode = require('../config/constant').httpcode;


class CategoryController {
  getAll(req, res, next) {
    async.series({
      categories: (done) => {
        Category.find({}, done);
      },
      totalCount: (done) => {
        done(Category.count);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    })
  }

  getOne(req, res, next) {
    Category.findById(req.params.categoryId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(httpcode.NOT_FOUND);
      }
      return res.status(httpcode.OK).send(doc);
    })
  }

  create(req, res, next) {
    Category.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `categories/${doc._id}`});
    })
  }

  delete(req, res, next) {
    const categoryId = req.params.categoryId;
    async.waterfall([
      (done) => {
        Category.findByIdAndDelete(req.params.categoryId, done)
      },
      (doc, done) => {
        if (!doc) {
          return done({status: 404}, null);
        }
        Item.find({category: categoryId}, done)
      },
      (docs, done) => {
        if (!docs) {
          return done(true, null);
        }
        async.map(docs, (item, callback) => {
          Item.remove(item, callback);
        }, done);
      },
    ], (err) => {
      if (err && err.status) {
        return res.sendStatus(httpcode.NOT_FOUND);
      }
      return res.sendStatus(httpcode.NO_CONTENT)
    })
  }

  update(req, res, next) {
    Category.findByIdAndUpdate(req.params.categoryId, req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(httpcode.NOT_FOUND);
      }
      return res.sendStatus(httpcode.NO_CONTENT)
    })
  }
}

module.exports = CategoryController;
