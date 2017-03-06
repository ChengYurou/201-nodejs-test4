const Cart = require('../model/cart');
const async = require('async');
const httpcode = require('../config/constant').httpcode;


class CartController {
  getAll(req, res, next) {
    async.series({
      carts: (done) => {
        Cart.find({})
            .populate('item')
            .exec((err, docs) => {
              const data = docs.items.toJSON.map(item => {
                return Object.assign({}, item, {uir: `items/${item._id}`});
              })
            }, done);
      },
      totalCount: (done) => {
        done(Cart.count);
      }
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.OK).send(result);
    })
  }

  getOne(req, res, next) {
    Cart.findById(req.params.cartId, (err, doc) => {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return res.sendStatus(httpcode.NOT_FOUND);
      }

      const data = doc.toJSON.map(item => {
        return Object.assign({}, item, {uir: `items/${item._id}`});
      })

      return res.status(httpcode.OK).send(data);
    })
  }

  create(req, res, next) {
    Cart.create(req.body, (err, doc) => {
      if (err) {
        return next(err);
      }
      return res.status(httpcode.CREATED).send({uri: `carts/${doc._id}`});
    })
  }

  delete(req, res, next) {
    Cart.findByIdAndRemove(req.params.cartId, (err, doc) => {
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
    Cart.findByIdAndUpdate(req.params.cartId, req.body, (err, doc) => {
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

module.exports = CartController;
