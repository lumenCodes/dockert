const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory data store for house listings
let houses = [
  {
    id: 1,
    title: "Cozy 2-Bedroom Apartment",
    location: "Downtown",
    pricePerMonth: 1200,
    isAvailable: true
  },
  {
    id: 2,
    title: "Modern Suburban Villa",
    location: "Westside",
    pricePerMonth: 2500,
    isAvailable: false
  }
];

let nextId = 3;

// Health Check Endpoint (useful for Docker health checks)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server running smoothly' });
});

// --- CRUD ENDPOINTS ---

// GET /api/houses - Fetch all house listings
app.get('/api/houses', (req, res) => {
  res.status(200).json(houses);
});

// GET /api/houses/:id - Fetch a single house by ID
app.get('/api/houses/:id', (req, res) => {
  const houseId = parseInt(req.params.id, 10);
  const house = houses.find(h => h.id === houseId);

  if (!house) {
    return res.status(404).json({ error: 'House listing not found' });
  }

  res.status(200).json(house);
});

// POST /api/houses - Create a new house listing
app.post('/api/houses', (req, res) => {
  const { title, location, pricePerMonth, isAvailable } = req.body;

  if (!title || !location || pricePerMonth === undefined) {
    return res.status(400).json({ 
      error: 'Missing required fields: title, location, pricePerMonth' 
    });
  }

  const newHouse = {
    id: nextId++,
    title,
    location,
    pricePerMonth: Number(pricePerMonth),
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true
  };

  houses.push(newHouse);
  res.status(201).json(newHouse);
});

// PUT /api/houses/:id - Update an existing house listing
app.put('/api/houses/:id', (req, res) => {
  const houseId = parseInt(req.params.id, 10);
  const houseIndex = houses.findIndex(h => h.id === houseId);

  if (houseIndex === -1) {
    return res.status(404).json({ error: 'House listing not found' });
  }

  const { title, location, pricePerMonth, isAvailable } = req.body;

  // Update provided fields or retain current values
  houses[houseIndex] = {
    ...houses[houseIndex],
    title: title !== undefined ? title : houses[houseIndex].title,
    location: location !== undefined ? location : houses[houseIndex].location,
    pricePerMonth: pricePerMonth !== undefined ? Number(pricePerMonth) : houses[houseIndex].pricePerMonth,
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : houses[houseIndex].isAvailable
  };

  res.status(200).json(houses[houseIndex]);
});

// DELETE /api/houses/:id - Delete a house listing
app.delete('/api/houses/:id', (req, res) => {
  const houseId = parseInt(req.params.id, 10);
  const houseIndex = houses.findIndex(h => h.id === houseId);

  if (houseIndex === -1) {
    return res.status(404).json({ error: 'House listing not found' });
  }

  houses.splice(houseIndex, 1);
  res.status(200).json({ message: `House with ID ${houseId} deleted successfully` });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`House Renting Service is listening on port ${PORT}`);
});