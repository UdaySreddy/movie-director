const express = require("express");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const path = require("path");
let dataBase = path.join(__dirname, "moviesData.db");
let db = null;
const initiizeDB = async () => {
  try {
    db = await open({
      filename: dataBase,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server http://localhost:3000 running....");
    });
  } catch (error) {
    console.log(`error message: ${error.message}`);
    process.exit(1);
  }
};
initiizeDB();

//Apis start

//get api for all movie names

app.get("/movies/", async (request, response) => {
  const movieQuery = `
    SELECT movie_name from movie;`;

  let moviesName = await db.all(movieQuery);

  let x = moviesName.map((each) => {
    let x1 = {};
    x1.movieName = each.movie_name;
    return x1;
  });
  response.send(x);
});

//post api for creating new movie

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const updateQuery = `
  insert into movie (director_id,movie_name,lead_actor)
  VALUES 
  (${directorId},'${movieName}','${leadActor}');`;
  let newmovie = await db.run(updateQuery);
  response.send("Movie Successfully Added");
});

//get movie based on movie id

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `
  select * from movie
  where movie_id = ${movieId} ;`;
  let reqMovie = await db.all(getMovieQuery);
  let y1 = {};
  let y = reqMovie.map((each) => {
    y1.movieId = each.movie_id;
    y1.directorId = each.director_id;
    y1.movieName = each.movie_name;
    y1.leadActor = each.lead_actor;
    return y1;
  });
  response.send(y1);
});

//update movie details

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const putQuery = `
  update 
  movie set
  
  director_id=${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  
  where
  movie_id = ${movieId};`;
  let newmovie = await db.run(putQuery);
  response.send("Movie Details Updated");
});

//delete based on mv id

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
    delete from movie where
     movie_id = ${movieId} ;`;

  let deleteMoviesName = await db.run(deleteMovieQuery);

  response.send("Movie Removed");
});

//get list of directors

app.get("/directors/", async (request, response) => {
  const movieQuery = `
    SELECT * from director;`;

  let moviesName = await db.all(movieQuery);

  let z = moviesName.map((each) => {
    let z1 = {};
    z1.directorId = each.director_id;
    z1.directorName = each.director_name;
    return z1;
  });
  response.send(z);
});

//get all movies by a director

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const joinQuery = `select movie_name 
  from 
  movie inner join director
  where director.director_id = ${directorId};`;
  let result = await db.all(joinQuery);
  let h = result.map((each) => {
    let h1 = {};
    h1.movieName = each.movie_name;
    return h1;
  });
  response.send(h);
  console.log(h);
});

module.exports = app;
