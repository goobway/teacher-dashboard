// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

// Create an Express app and set the listening port
const app = express();
const port = 3000;

// Serve static files using the express.static middleware
app.use(express.static('public'));

// Configure the app to use the body-parser middleware for JSON data
app.use(bodyParser.json());

// Define the MongoDB connection URI
const uri = 'mongodb://127.0.0.1:27017';
// Create a new MongoClient instance
const client = new MongoClient(uri);

// Route to serve a simple response at the root path
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

// Create a new route to serve the HTML file
app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to add student data (integrated with MongoDB)
app.post('/add', async (req, res) => {
  const { studentId, prompt, classification, confidence, matrix } = req.body;

  if (
    typeof studentId !== 'number' ||
    !Number.isInteger(studentId) ||
    typeof prompt !== 'string' ||
    typeof classification !== 'string' ||
    typeof confidence !== 'number' ||
    !Array.isArray(matrix) ||
    !matrix.every(subArray => Array.isArray(subArray) && subArray.every(item => typeof item === 'number'))
  ) {
    return res.status(400).json({ error: 'Invalid data format.' });
  }

  try {
    // Connect to the MongoDB server
    await client.connect();
    // Get the 'dashboardData' database
    const db = client.db('dashboardData');
    // Get the 'frame_of_knowledge' collection
    const collection = db.collection('frame_of_knowledge');

    // Insert the student data into the collection
    await collection.insertOne({ studentId, prompt, classification, confidence, matrix });

    res.status(200).json({ message: 'Student data added successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error storing data');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Endpoint to get all student data
app.get('/values', async (req, res) => {
  try {
    // Connect to the MongoDB server
    await client.connect();
    // Get the 'dashboardData' database
    const db = client.db('dashboardData');
    // Get the 'frame_of_knowledge' collection
    const collection = db.collection('frame_of_knowledge');

    // Find all documents in the collection and convert them to an array
    const data = await collection.find().toArray();

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

// Endpoint to delete data for a specific prompt
app.delete('/delete/:prompt', async (req, res) => {
  const studentId = parseInt(req.params.prompt);

  if (isNaN(studentId)) {
    return res.status(400).json({ error: 'Invalid prompt.' });
  }

  try {
    // Connect to the MongoDB server
    await client.connect();
    // Get the 'dashboardData' database
    const db = client.db('dashboardData');
    // Get the 'frame_of_knowledge' collection
    const collection = db.collection('frame_of_knowledge');

    // Delete the document with the specified student ID
    const result = await collection.deleteMany({ prompt: prompt });

    if (result.deletedCount === 0) {
      res.status(404).json({ message: 'No data found with the specified prompt.' });
    } else {
      res.status(200).json({ message: 'Data deleted successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting data');
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});
