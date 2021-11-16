// starter code in both routes/celebrities.routes.js and routes/movies.routes.js
const router = require("express").Router();
const Celebrity = require("./../models/Celebrity.model");
const Movie = require("./../models/Movie.model");

router
  .route("/create")
  .get(async (req, res) => {
    try {
      const allCelebs = await Celebrity.find();
      res.render("movies/new-movie.hbs", { allCelebs });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { title, genre, plot, cast } = req.body;
      const createdMovie = await Movie.create({ title, genre, plot, cast });
      console.log(createdMovie);

      res.redirect("/movies");
    } catch (error) {
      console.log(error);
    }
  });

// POPULATE
// Movie.find().populate("cast")   <=== a string of the field you want to populate

router.get("/", async (req, res) => {
  try {
    const allMovies = await Movie.find().populate("cast");
    res.render("movies/movies", { allMovies });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const foundMovie = await Movie.findById(id).populate("cast");
    res.render("movies/movie-details", { movie: foundMovie });
  } catch (error) {
    console.log(error);
  }
});

router.post("/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMovie = await Movie.findByIdAndDelete(id);
    console.log(deletedMovie);
    res.redirect("/movies");
  } catch (error) {
    console.log(error);
  }
});

router
  .route("/:id/edit")
  .get(async (req, res) => {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id).populate("cast");
      const allCelebs = await Celebrity.find();

      // This is an example of logic from Module 1 into the routes of Module 2
      // This is filtering the allCelebs to print the celebrities from the movie as "checked"
      // and the rest of the celebrities as "unchecked" on the edit-movie.hbs form
      const filteredCelebs = allCelebs.filter((cel) => {
        return !movie.cast.find((cas) => cel.name === cas.name);
      });

      res.render("movies/edit-movie", { movie, allCelebs: filteredCelebs });
    } catch (error) {
      console.log(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { id } = req.params;
      const { title, genre, plot, cast } = req.body;
      const updatedMovie = await Movie.findByIdAndUpdate(
        id,
        { title, genre, plot, cast },
        { new: true }
      );
      res.redirect(`/movies/${id}`);
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
