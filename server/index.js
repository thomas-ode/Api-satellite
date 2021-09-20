const express = require("express");
var cors = require('cors')
var app = express()
const request = require('request');

app.use(cors())
const PORT = process.env.PORT || 3001;


app.get('/satellite/:id/:observer_lat/:observer_lng/:observer_alt/:days/:min_visibility/', (req, res) => {
    var id = req.params.id
    var observer_lat = req.params.observer_lat
    var observer_lng = req.params.observer_lng
    var observer_alt = req.params.observer_alt
    var days = req.params.days
    var min_visibility = req.params.min_visibility
    request(
      { url: `https://api.n2yo.com/rest/v1/satellite/visualpasses/${id}/${observer_lat}/${observer_lng}/${observer_alt}/${days}/${min_visibility}/&apiKey={Your API Key}` },
      (error, response, body) => {
        if (error || response.statusCode !== 200) {
          return res.status(500).json({ type: 'error', message: err.message });
        }
        res.json(JSON.parse(body));
      }
    )
  });


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});