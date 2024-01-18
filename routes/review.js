const express = require("express");
const router = express.Router({mergeParams:true});

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schemas");
 
const Campground = require("../models/campgrounds");
const Review = require("../models/review");


const ValidateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  ValidateReview,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;