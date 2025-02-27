const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Custom token to log POST request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Use morgan with custom logging format to log POST data
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number is missing",
    });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: persons.length + 1,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const currentDate = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentDate}</p>
  `);
});

// Middleware for unknown endpoints (404 handler)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
