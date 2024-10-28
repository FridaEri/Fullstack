const dotenv = require('dotenv');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const path = require('path');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.PGURI,
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.static(path.join(path.resolve(), 'dist')));

// Hämta alla inlägg
app.get('/api/posts', async (_request, response) => {
  try {
    const result = await pool.query('SELECT posts.*, categories.name AS category_name FROM posts JOIN categories ON posts.category_id = categories.id');
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});

// Hämta inlägg baserat på titel
app.get('/api/posts/title/:title', async (req, response) => {
  const { title } = req.params;
  try {
    const result = await pool.query(
      'SELECT posts.*, categories.name AS category_name FROM posts JOIN categories ON posts.category_id = categories.id WHERE posts.title ILIKE $1',
      [title]
    );
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});

// Hämta alla kategorier
app.get('/api/categories', async (_request, response) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});

// Lägg till ny inlägg
app.post('/api/posts', async (req, response) => {
  const { title, content, category_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO posts (title, content, category_id) VALUES ($1, $2, $3) RETURNING *', [title, content, category_id]);
    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});

// Uppdatera inlägg
app.put('/api/posts/:id', async (req, response) => {
  const { id } = req.params;
  const { title, content, category_id } = req.body;
  try {
    const result = await pool.query('UPDATE posts SET title = $1, content = $2, category_id = $3 WHERE id = $4 RETURNING *', [title, content, category_id, id]);
    response.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});

// Ta bort inlägg
app.delete('/api/posts/:id', async (req, response) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    response.status(204).send();
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
});


app.listen(port, () => {
  console.log(`Redo på http://localhost:${port}/`);
});
