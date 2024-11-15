const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const app = express();

const db = new sqlite3.Database('./cars.db', (err) => {
 if (err) {
  console.error(err.message);
 } else {
  console.log('Connected to the database.');

  db.run(`
   CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
    description TEXT NOT NULL,
	brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price REAL NOT NULL
   )
  `);
 }
});


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 


app.post('/add_car', (req, res) => {
 const {name,description, brand, model, year, price } = req.body;

 db.run(
  'INSERT INTO cars (name,description,brand, model, year, price) VALUES (?,?,?, ?, ?, ?)',
  [name,description,brand, model, year, price],
  (err) => {
   if (err) {
    console.error('Ошибка добавления автомобиля:', err);
    res.status(500).send('Ошибка добавления автомобиля');
   } else {
    res.redirect('/cars');
   }
  }
 );
});


app.get('/cars', (req, res) => {
 db.all('SELECT * FROM cars', (err, rows) => {
  if (err) {
   console.error('Ошибка получения списка автомобилей:', err);
   res.status(500).send('Ошибка получения списка автомобилей');
  } else {
   res.json(rows); 
  }
 });
});

app.listen(3500, () => {
 console.log('Сервер запущен на порту 3500');
});
