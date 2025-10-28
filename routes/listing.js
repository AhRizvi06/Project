const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, schemaValidator } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
  //index route
  // .get(
  //   wrapAsync(ListingController.index)
  // )
  .get(async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    console.error("Error loading listings:", err);
    next(err);
  }
})
  //add route
  .post(isLoggedIn,
    upload.single("listing[image]"),
    schemaValidator,

    wrapAsync(ListingController.addListing)
  );


//Create route
router.get("/new", isLoggedIn, ListingController.renderForm);

router.route("/:id")
  //show route
  .get(
    wrapAsync(ListingController.showListing)
  )
  //update route
  .put(
    isLoggedIn, isOwner,
    upload.single("listing[image]"),
    schemaValidator,
    wrapAsync(ListingController.updateListing)
  )
  //delete route
  .delete(
    isLoggedIn, isOwner,
    wrapAsync(ListingController.destroyListing)
  );


//edit route
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;