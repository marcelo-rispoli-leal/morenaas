import { db } from '../services/db.js';
import errors from '../libs/errors.js';
import gets from '../libs/getters.js';
import { formatName } from '../libs/formatters.js';

//worker registers a movie
const createMovie = async (req, res, next) => {
  try {
    //checks access rights
    errors.workerAccessOnly(req.worker);

    //check body and load fields
    errors.requiredBody(req.body);
    let { title, director } = req.body;

    //checks required field
    errors.requiredFields({ title, director });

    //formats names
    title = formatName(title);
    director = formatName(director);

    //checks if movie already registered
    let sql = `select 1 from movies where title=$1 and director=$2`;
    let result = await db.pool.query(sql, [title, director]);
    if (result.rowCount === 1) {
      errors.movieAlreadyExists(title, director);
    }

    //registers the new movie
    sql = 'INSERT INTO movies (title, director) VALUES ($1, $2) RETURNING id';
    result = await db.pool.query(sql, [title, director]);

    //sends the new movie in response
    res.send({ id: result.rows[0].id, title, director });
  } catch (err) {
    next(err);
  }
};

//worker registers a movie tape
const createTape = async (req, res, next) => {
  try {
    //checks access rights
    errors.workerAccessOnly(req.worker);

    //check body and load fields
    errors.requiredBody(req.body);
    let { movie_id } = req.body;

    //checks required field
    errors.requiredFields({ movie_id });

    //checks if movie not found
    let sql = `select title, director from movies where id=$1`;
    let result = await db.pool.query(sql, [movie_id]);
    if (result.rowCount === 0) {
      errors.movieNotFound(id);
    }

    let movie = result.rows[0];

    //registers the new tape
    sql = 'INSERT INTO tapes (movie_id) VALUES ($1) RETURNING id';
    result = await db.pool.query(sql, [movie_id]);

    //sends the new movie tape in response
    res.send({ id: result.rows[0].id, movie_id, ...movie, available: true });
  } catch (err) {
    next(err);
  }
};

//customer rents movies
const rentMovies = async (req, res, next) => {
  try {
    //checks access rights
    errors.customerAccessOnly(req.customer);

    //check body and load fields
    errors.requiredBody(req.body);
    let { movies_id } = req.body;

    //checks required field
    errors.requiredFields({ movies_id });

    //check ids
    let search = [];
    for (let i = 0; i < movies_id.length; i++) {
      const id = parseInt(movies_id[i]);

      if (!isNaN(id) && id >= 1) {
        search.push(id);
      }
    }

    if (search.length === 0) {
      errors.invalidMovies();
    }

    //remove duplicates
    search = Array.from(new Set(search));

    //updates rented medias
    let sql = 'UPDATE tapes SET available=false WHERE id in ';
    sql += `(SELECT min(id) FROM tapes WHERE movie_id in (${search.toString()})`;
    sql += ' AND available=true GROUP BY movie_id) RETURNING id';

    //executes update
    let result = await db.pool.query(sql);

    //sends error if no movie was rented
    if (result.rowCount === 0) {
      errors.moviesIdsNotFound();
    }

    //gets rent dates
    const created_at = gets.now();
    const deadline = gets.addDays(created_at, result.rowCount);

    //adds rented movie tapes in array
    let tapes = [];
    for (let i = 0; i < result.rowCount; i++) {
      tapes.push(result.rows[i].id);
    }

    //records rent
    sql = 'INSERT INTO rents (cpf, name, email, created_at, deadline) ';
    sql += 'SELECT cpf, name, email, $1, $2 FROM users WHERE cpf=$3 ';
    sql += 'RETURNING id, cpf, name, email, created_at, deadline';
    result = await db.pool.query(sql, [created_at, deadline, req.cpf]);
    let rent = result.rows[0];

    //records tapes rented
    sql = 'INSERT INTO rents_tapes (rent_id,tape_id,movie_id,title,director) ';
    sql += 'SELECT $1, t.id, m.* FROM movies m INNER JOIN tapes t ON ';
    sql += `m.id = t.movie_id WHERE t.id in (${tapes.toString()}) `;
    sql += 'RETURNING tape_id, movie_id, title, director';
    result = await db.pool.query(sql, [rent.id]);
    tapes = result.rows;

    //prepares and sends response
    rent = { ...rent, tapes };
    res.send(rent);
  } catch (err) {
    next(err);
  }
};

//customer returns movie rented
const returnMovies = async (req, res, next) => {
  try {
    //checks access rights
    errors.customerAccessOnly(req.worker);

    //check body and load fields
    errors.requiredBody(req.body);
    let { rent_id } = req.body;

    //checks required field
    errors.requiredFields({ rent_id });

    //checks rented tapes
    let sql = 'SELECT r.cpf, r.name, r.email, t.id, t.tape_id, t.movie_id, ';
    sql += 't.title, t.director FROM rents r INNER JOIN rents_tapes t ON ';
    sql += 'r.id=t.rent_id WHERE r.id=$1 and returned=$2';
    let result = await db.pool.query(sql, [rent_id, false]);

    //sends error if no movie was rented
    if (result.rowCount === 0) {
      errors.rentedTapesNotFound();
    }

    //gets return date
    const returned_at = gets.now();
    const { cpf, name, email } = result.rows[0];
    let rent = { id: rent_id, cpf, name, email, returned_at };

    //sends error if no movie was rented
    if (cpf !== req.cpf) {
      errors.invalidRent(rent_id);
    }

    //adds rented movie tapes in array
    let tapes = [];
    let ids = [];
    for (let i = 0; i < result.rowCount; i++) {
      const { tape_id, movie_id, title, director } = result.rows[i];
      tapes.push({ tape_id, movie_id, title, director });
      ids.push(result.rows[i].tape_id);
    }

    //updates returned tapes
    sql = 'UPDATE rents_tapes SET returned=$1, returned_at=$2 ';
    sql += 'WHERE rent_id=$3 and returned=$4';
    await db.pool.query(sql, [true, returned_at, rent_id, false]);

    //updates available tapes
    sql = `UPDATE tapes SET available=true WHERE id in (${ids.toString()})`;
    await db.pool.query(sql);

    //prepares and sends response
    rent = { ...rent, tapes };
    res.send(rent);
  } catch (err) {
    next(err);
  }
};

//users gets a list of movies by status and / or title filter
function findAll(status) {
  return async (req, res, next) => {
    try {
      //checks access rights on rented movies list
      if (status === 'rented') {
        errors.workerAccessOnly(req.worker);
      }

      //loads movies or sends a error if not found
      const { title } = req.query;
      const movies = await gets.movies(status, title);

      //sends result
      res.send(movies);
    } catch (err) {
      next(err);
    }
  };
}

export default {
  createMovie,
  createTape,
  rentMovies,
  returnMovies,
  findAll,
};
