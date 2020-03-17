const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post("", (req, res, next) => {
  const user = new User({
    name: req.body.name,
    gender: req.body.gender,
    mobile: req.body.mobile,
    email: req.body.email
  })
  user.save()
    .then(createdUser => {
      res.status(201).json({
        message: "Succesfull",
        userId: createdUser._id
      });
    });
});

router.get("", (req, res, next) => {
  User.find()
    .then(documents => {
      res.status(200).json({
        message: "succesfull",
        users: documents
      });
    });
})

router.put("/:id", (req, res, next) => {
  const user = new User({
    _id: req.body.id,
    name: req.body.name,
    gender: req.body.gender,
    mobile: req.body.mobile,
    email: req.body.email
  });
  User.updateOne({ _id: req.params.id }, user)
    .then(result => {
      res.status(200).json({
        message: "Updated User"
      })
    });
})

router.get("/:id", (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({
        message: "User not found"
      })
    }
  })
});

router.delete("/:id", (req, res, next) => {
  User.deleteOne({ _id: req.params.id })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Succesfully Deleted"
      });
    });
});

module.exports = router;
