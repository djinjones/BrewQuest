const router = require('express').Router();
const fetch = require('node-fetch');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');
const { Brewery, BlogPost } = require('../../models'); // Adjust the path to your model
require('dotenv').config();

router.get('/', async (req, res) => {
  try {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const breweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=15`;
    const response = await fetch(breweryUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch breweries');
    }

    const breweries = await response.json();

    // Transform the data to match your model
    const breweryData = breweries.map(brewery => ({
      id: brewery.id, // Assuming `id` is present in the API response and is unique
      name: brewery.name,
      brewery_type: brewery.brewery_type,
      street: brewery.street,
      city: brewery.city,
      state: brewery.state,
      postal_code: brewery.postal_code,
      country: brewery.country,
      longitude: brewery.longitude,
      latitude: brewery.latitude,
      phone: brewery.phone,
      website_url: brewery.website_url,
    }));

    // Get the IDs of the breweries from the API response
    const breweryIds = breweryData.map(brewery => brewery.id);

    // Find existing breweries in the database with the same IDs
    const existingBreweries = await Brewery.findAll({
      where: {
        id: {
          [Op.in]: breweryIds
        }
      }
    });

    // Get the IDs of the existing breweries
    const existingBreweryIds = existingBreweries.map(brewery => brewery.id);

    // Filter out the breweries that are already in the database
    const newBreweries = breweryData.filter(brewery => !existingBreweryIds.includes(brewery.id));

    // Insert only the new breweries into the database
    if (newBreweries.length > 0) {
      await Brewery.bulkCreate(newBreweries);
    }

    res.status(200).json(newBreweries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
  

router.get('/:id', async (req, res) => {
  try {
    const user = await req.session.username;

    const currentBrewery = await Brewery.findByPk(req.params.id, {
      include: [{
        model: BlogPost,
        as: 'blogs',
      }],
      })
      const posts = currentBrewery
      
      res.render('homepage', {
        posts, user, showDeleteButton: false, loggedIn: req.session.loggedIn, apiKey: process.env.GOOGLE_MAPS_API_KEY,
    
    });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
    
        if (!latitude || !longitude) {
          return res.status(400).json({ error: 'Latitude and longitude are required' });
        }
    
        // Process the location data as needed
        console.log(`Received coordinates: Latitude ${latitude}, Longitude ${longitude}`);
    
        // Radius in miles
        const radius = 10;
        const earthRadius = 3959; // Radius of the Earth in miles
    
        // Perform a raw SQL query to find breweries within the specified radius
        const breweries = await Brewery.sequelize.query(
            `SELECT b.*, d.distance
            FROM "Brewery" b
            INNER JOIN (
              SELECT id, (
                ${earthRadius} * acos(
                  cos(radians(CAST(:latitude AS float))) * cos(radians(CAST(latitude AS float))) * cos(radians(CAST(longitude AS float)) - radians(CAST(:longitude AS float))) +
                  sin(radians(CAST(:latitude AS float))) * sin(radians(CAST(latitude AS float)))
                )
              ) AS distance
              FROM "Brewery"
            ) d ON b.id = d.id
            WHERE d.distance < :radius
            ORDER BY d.distance`,
            {
            replacements: { latitude, longitude, radius },
            type: Sequelize.QueryTypes.SELECT
          }
        );

        if (breweries.length < 15) {
            const breweryUrl = `https://api.openbrewerydb.org/v1/breweries?by_dist=${latitude},${longitude}&per_page=15`;
    const response = await fetch(breweryUrl);

    if (!response.ok) {
      throw new Error('Failed to fetch breweries');
    }

    const breweries = await response.json();

    // Transform the data to match your model
    const breweryData = breweries.map(brewery => ({
      id: brewery.id, // Assuming `id` is present in the API response and is unique
      name: brewery.name,
      brewery_type: brewery.brewery_type,
      street: brewery.street,
      city: brewery.city,
      state: brewery.state,
      postal_code: brewery.postal_code,
      country: brewery.country,
      longitude: brewery.longitude,
      latitude: brewery.latitude,
      phone: brewery.phone,
      website_url: brewery.website_url,
    }));

    // Get the IDs of the breweries from the API response
    const breweryIds = breweryData.map(brewery => brewery.id);

    // Find existing breweries in the database with the same IDs
    const existingBreweries = await Brewery.findAll({
      where: {
        id: {
          [Op.in]: breweryIds
        }
      }
    });

    // Get the IDs of the existing breweries
    const existingBreweryIds = existingBreweries.map(brewery => brewery.id);

    // Filter out the breweries that are already in the database
    const newBreweries = breweryData.filter(brewery => !existingBreweryIds.includes(brewery.id));

    // Insert only the new breweries into the database
    if (newBreweries.length > 0) {
      await Brewery.bulkCreate(newBreweries);
    }

    res.status(200).json(newBreweries);

          } else {
             res.status(200).json(breweries);
          }
    
        // Respond to the client with the list of nearby breweries
       
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
      }
    });

module.exports = router;


// Breweries to omit: Fermaentra,