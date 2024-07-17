const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");


router.put("/add-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavorited = userData.favourite.includes(bookid);
    if (isBookFavorited) {
      return res.json({
        status: "Success",
        message: "Book is already in favourites",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { favourite: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to favourites",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourite");
    const favouriteBooks = userData.favourite;
    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});


router.put("/remove-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    await User.findByIdAndUpdate(id, {
      $pull: { favourite: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book removed from favourites",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
module.exports = router;
