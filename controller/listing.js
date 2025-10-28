const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const {category,q} = req.query;
    const categories = Listing.schema.path("category").enumValues;
    let filter = {};
    if(category && category !== "All"){
      filter.category = category;
    }
    if(q && q.trim() !== ""){
      filter.title = { $regex: q, $options: "i" };
    }
    const allListings = await Listing.find(filter);
    res.render("./listings/index.ejs", { allListings, categories,
    selectedCategory: category || "All",
   searchQuery: q || "" });
  };

module.exports.renderForm = (req, res) => {
   const category = Listing.schema.path("category").enumValues;
  res.render("./listings/new.ejs", { category });
};

module.exports.addListing = async (req, res, next) => {
    let url= req.file.path;
    let filename= req.file.filename;
    let newlisting = new Listing(req.body.listing);
    
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    await newlisting.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested is not found!");
      return res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { listing });
  };

 module.exports.renderEditForm = async (req, res) => {
     let { id } = req.params;
     let listing = await Listing.findById(id);
     if (!listing) {
       req.flash("error", "Listing you requested is not found!");
       return res.redirect("/listings");
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
     res.render("./listings/edit.ejs", { listing, originalImageUrl });
   };

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = req.body.listing;
    let updatedListing = await Listing.findByIdAndUpdate(id, listing, {
      runValidators: true,
      new: true,
    });
    if(typeof req.file !== "undefined"){
    let url= req.file.path;
    let filename= req.file.filename;
    updatedListing.image = {url,filename};
    await updatedListing.save();
  }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
    console.log(updatedListing);
  };

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
    console.log("Listing Deleted");
  };
  