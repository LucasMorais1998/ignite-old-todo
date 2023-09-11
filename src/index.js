const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [
  {
    id: "73e494b0-cb58-409f-9f28-5ddf30963671",
    name: "lucas",
    username: "lucasmds1998",
    todos: [
      {
        id: "0a04cc14-c70f-4ddf-a5cd-4a0d20c2d1c8",
        title: "fazer arroz",
        done: false,
        deadline: "2023-09-12T00:00:00.000Z",
        created_at: "2023-09-10T18:05:46.230Z",
      },
      {
        id: "b2a0e11a-ab62-4066-8451-c0130ed5189d",
        title: "comprar leite",
        done: false,
        deadline: "2023-09-12T00:00:00.000Z",
        created_at: "2023-09-10T18:39:47.087Z",
      },
      {
        id: "a5021ea9-2de7-47a3-a77e-a093639c420c",
        title: "codar site",
        done: false,
        deadline: "2023-09-12T00:00:00.000Z",
        created_at: "2023-09-10T18:56:17.319Z",
      },
    ],
  },
];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const isExistingUser = users.find((user) => user.username === username);

  if (isExistingUser) {
    return response.status(400).json({ error: "User already exists!" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { todos } = request.user;

  return response.json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo) {
    return response.status(404).json({ error: "todo not found!" });
  }

  todo.done = !todo.done;

  return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({ error: "todo not found!" });
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
