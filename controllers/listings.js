const Listing = require("../models/listing");
const maptilerClient = require("@maptiler/client");
const mapToken = process.env.MAP_TOKEN;
maptilerClient.config.apiKey = mapToken;

// 1. INDEX ROUTE (SEARCH LOGIC IS HERE)

module.exports.index = async (req, res) => {
  const { q, search } = req.query;
  let allListings;

  if (q) {
    allListings = await Listing.find({
      $or: [
        { location: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
      ],
    });

    if (allListings.length === 0) {
      req.flash("error", "No listings found matching '" + q + "'");
      return res.redirect("/listings");
    }
  } else {
    // If no search, show everything
    allListings = await Listing.find({});
  }

  // Logic to show/hide the search bar in the UI
  let showSearch = q || search ? true : false;

  res.render("listings/index.ejs", { allListings, showSearch });
};

// 2. RENDER NEW FORM

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 3. CREATE LISTING (AUTOMATIC MAP LOGIC)

module.exports.createListing = async (req, res, next) => {
  // 1. Get the location text from the form
  const locationQuery = req.body.listing.location;

  if (!locationQuery) {
    return res.status(400).json({ message: "Location/address is required." });
  }

  // 2. AUTOMATICALLY MAKE IT MAP (Geocoding)
  // This converts "New Delhi" into coordinates [77.209, 28.613]
  const geocodingResult = await maptilerClient.geocoding.forward(
    locationQuery,
    { limit: 1 }
  );

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  // 3. Save the coordinates to the database
  newListing.geometry = geocodingResult.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New listing created!");
  return res.redirect("/listings");
};

// 4. RENDER EDIT FORM

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// 5. UPDATE LISTING

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // Update text data
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  // If location changed, update the Map coordinates too
  if (req.body.listing.location) {
    const geocodingResult = await maptilerClient.geocoding.forward(
      req.body.listing.location,
      { limit: 1 }
    );
    listing.geometry = geocodingResult.features[0].geometry;
    await listing.save();
  }

  // If image changed, update image
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  return res.redirect(`/listings/${id}`);
};

// 6. SHOW LISTING

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// 7. DELETE LISTING

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  return res.redirect("/listings");
};
