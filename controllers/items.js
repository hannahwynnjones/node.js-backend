const Item = require('../models/item');

function indexRoute(req, res, next) {
  Item
    .find()
    .populate('createdBy')
    .exec()
    .then((items) => res.json(items))
    .catch(next);
}

function createRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  req.body.createdBy = req.user;

  Item
    .create(req.body)
    .then((item) => res.status(201).json(item))
    .catch(next);
}

function showRoute(req, res, next) {
  Item
    .findById(req.params.id)
    .populate('createdBy comments.createdBy')
    .exec()
    .then((item) => {
      if(!item) return res.notFound();

      res.json(item);
    })
    .catch(next);
}

function updateRoute(req, res, next) {

  // if(req.file) req.body.image = req.file.filename;
  Item
    .findById(req.params.id)
    .exec()
    .then((item) => {
      if(!item) return res.notFound();

      for(const field in req.body) {
        item[field] = req.body[field];
      }

      return item.save();
    })
    .then((item) => res.json(item))
    .catch(next);
}

function deleteRoute(req, res, next) {
  Item
    .findById(req.params.id)
    .exec()
    .then((item) => {
      if(!item) return res.notFound();

      return item.remove();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

function addCommentRoute(req, res, next) {

  req.body.createdBy = req.user;

  Item
    .findById(req.params.id)
    .exec()
    .then((item) => {
      if(!item) return res.notFound();

      const comment = item.comments.create(req.body);
      item.comments.push(comment);

      return item.save()
        .then(() => res.json(comment));
    })
    .catch(next);
}

function deleteCommentRoute(req, res, next) {
  Item
    .findById(req.params.id)
    .exec()
    .then((item) => {
      if(!item) return res.notFound();

      const comment = item.comments.id(req.params.commentId);
      comment.remove();

      return item.save();
    })
    .then(() => res.status(204).end())
    .catch(next);
}

module.exports = {
  index: indexRoute,
  create: createRoute,
  show: showRoute,
  update: updateRoute,
  delete: deleteRoute,
  addComment: addCommentRoute,
  deleteComment: deleteCommentRoute
};
