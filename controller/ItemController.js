const Item = require('../model/item');
const async = require('async');
const httpcode = require('../config/constant').httpcode;


class ItemController {
  getAll(req, res, next) {
    async.series({
      items: (done) => {
        Item.find({}, done);
      },
      totalCount: (done) => {
        done(Item.count);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    })
  }

  getOne(req, res, next) {
    Item.findById(req.params.itemId, (err, doc) => {
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
    Item.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `items/${doc._id}`});
    })
  }

  delete(req, res, next) {
    Item.findByIdAndRemove(req.params.itemId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(httpcode.NOT_FOUND);
      }
      return res.sendStatus(httpcode.NO_CONTENT)
    })
  }

  update(req, res, next) {
    Item.findByIdAndUpdate(req.params.itemId, req.body, (err, doc) => {
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

module.exports = ItemController;
