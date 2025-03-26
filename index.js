const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' },
];

app.get('/api/persons', (req, res) => res.json(persons));

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find((p) => p.id === req.params.id);

  if (!person) {
    return res.status(404).end();
  }

  return res.json(person);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number missing' });
  }

  if (persons.some((person) => person.name === name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = {
    id: Math.ceil(Math.random() * 1_000_000).toString(),
    name,
    number,
  };

  persons = [...persons, newPerson];
  return res.status(201).json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter((person) => person.id !== req.params.id);
  return res.status(204).end();
});

app.get('/info', (req, res) => {
  const info = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date()}</p>`;

  return res.send(info);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
