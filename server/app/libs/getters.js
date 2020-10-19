import moment from 'moment-timezone';
import { db } from '../services/db.js';
import errors from './errors.js';

//gets a current timestamp according defined timezone
function now() {
  const zone = process.env.TIMEZONE || 'America/Sao_Paulo';
  const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  return moment.tz(new Date(), zone).format(format);
}

//gets a date according informed parameters
function addDays(date = now(), days = 0) {
  const format = moment.HTML5_FMT.DATE;
  return moment(date).add(days, 'days').format(format);
}

//gets an user
async function user(key, value, select = null, errorNotFound = true) {
  let sql =
    select === null
      ? `select 1 from users where ${key}=$1`
      : `select ${select} from users where ${key}=$1`;

  const result = await db.pool.query(sql, [value]);

  if (result.rowCount === 0 && errorNotFound === true) {
    errors.userNotFound(key, value);
  } else if (result.rowCount === 1 && errorNotFound === false) {
    errors.userAlreadyExists(key, value);
  }

  return result.rows[0];
}

//gets a list of users
async function users(category = 'all', name = '') {
  let sql = 'select cpf, name, email from users where ';
  sql +=
    category === 'all'
      ? '1=1'
      : category === 'unchecked'
      ? 'customer=false and file_path is not null'
      : category === 'pf'
      ? 'worker=false'
      : 'worker=true';

  if (!name.trim() !== '') {
    sql += ` and name ilike '%${name}%'`;
  }

  const result = await db.pool.query(sql);

  if (result.rowCount === 0) {
    errors.usersNotFound(category, name);
  }

  return result.rows;
}

//gets a list of movies
async function movies(status = 'all', title = '') {
  //query start
  let sql = 'SELECT m.*, count(1)::int "total_count"';

  //adds available count field if lists all status
  if (status === 'all') {
    sql +=
      ', sum(case available when true then 1 else 0 end)::int "available_count"';
  }

  //adds tables and initial where clause
  sql += ` FROM movies m INNER JOIN tapes t ON m.id = t.movie_id WHERE `;
  sql +=
    status === 'all'
      ? '1=1'
      : status === 'available'
      ? 't.available=true'
      : 't.available=false';

  //complements where clause if title filter informed
  if (title.trim() !== '') {
    sql += ` AND m.title ilike '%${title}%'`;
  }

  //finish query with clauses group by and order by;
  sql += ` GROUP BY m.id, m.title, m.director ORDER BY m.title, m.director`;

  //executes query
  const result = await db.pool.query(sql);

  //sends error if movies not found
  if (result.rowCount === 0) {
    errors.moviesNotFound(status, title);
  }

  //return movies
  return result.rows;
}

export default {
  now,
  addDays,
  user,
  users,
  movies,
};
