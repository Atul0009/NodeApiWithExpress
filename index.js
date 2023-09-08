import express from "express";


const app = express();
const port = 5000

app.use(express.json());



// Sample users data 
const users = [
  { id: 1, username: 'abc', password: 'abcpassword' },
  { id: 2, username: 'xyz', password: 'xyzpassword' },
];



// Middleware for basic authentication
function authenticateUser(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: 'Authentication failed. Provide username and password.' });
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed.' });
  }

  req.user = user;
  next();
}

// Middleware for authorization (checks if a user is authenticated)
function authorizeUser(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ message: 'Authorization failed. User not authenticated.' });
  }
  next();
}

// ################# Routes ###################

//Get all users
app.get('/users', authorizeUser, (req, res) => {
       return res.json(users);
});

// Creating new user
app.post('/users', (req, res) => {
  
  const newUser = req.body;
  users.push(newUser);
  return res.status(200).json(newUser);
});

// Get user by id
app.get('/users/:id', authorizeUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json(user);
});

// Update user
app.put('/users/:id', authorizeUser, (req, res) => {
  const userId = parseInt(req.params.id);
  const updatedUser = req.body;

  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  users[index] = { ...users[index], ...updatedUser };
  return res.json(users[index]);
});

// Delete user
app.delete('/users/:id', authorizeUser, (req, res) => {
  const userId = parseInt(req.params.id);

  const index = users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found.' });
  }

  users.splice(index, 1);
  return res.json(users)
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });