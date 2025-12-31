require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Generate random flight data
function randomFlightData() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const flightNumber = letters.charAt(Math.floor(Math.random() * letters.length)) +
                         letters.charAt(Math.floor(Math.random() * letters.length)) +
                         Math.floor(100 + Math.random() * 900);

    const countries = ['USA', 'UK', 'Germany', 'France', 'Japan', 'Brazil', 'Canada'];
    const aircraftTypes = ['Boeing 737', 'Airbus A320', 'Cessna 172', 'Embraer E190'];
    const airlines = ['Delta', 'Lufthansa', 'Air France', 'United', 'Emirates', 'ANA'];

    return {
        title: "✈️ Plane Overhead!",
        flightNumber,
        originCountry: countries[Math.floor(Math.random() * countries.length)],
        distance: `${(Math.random() * 50).toFixed(1)} km`,
        aircraftType: aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)],
        airline: airlines[Math.floor(Math.random() * airlines.length)]
    };
}

// Trigger NoviSign
app.post('/trigger', async (req, res) => {
    const flightData = randomFlightData();

    try {
        await axios.post(process.env.NOVISIGN_URL, { data: flightData }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': process.env.NOVISIGN_API_KEY
            }
        });
        console.log('✅ NoviSign Event Sent:', flightData);
        res.json({ success: true, flightData });
    } catch (error) {
        console.error('❌ Failed to send to NoviSign:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
