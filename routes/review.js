const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {reviewValidator, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/review.js");


//review route
router.post("/" ,isLoggedIn,reviewValidator, wrapAsync(reviewController.createReview));

//review delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;