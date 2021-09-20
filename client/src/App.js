import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import useGeolocation from "./hooks/useGeolocalisation";

function App() {
  const location = useGeolocation();
  const [satellite, setSatellite] = useState([]);
  const [lat, setLat] = useState(45);
  const [long, setLong] = useState(45);
  const [startVisibility, setStartVisibility] = useState("");
  const [endVisibility, setEndVisibility] = useState("");
  const [direction, setDirection] = useState("");
  const [durationSat, setDurationSat] = useState(0);

  function unixToDate(time) {
    let unix = time;
    var date = new Date(unix * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var secondes = "0" + date.getSeconds();
    var formattedTime =
      hours + ":" + minutes.substr(-2) + ":" + secondes.substr(-2);
    return `${date} - à: ${formattedTime}`;
  }

  useEffect(() => {
    if (satellite.length != 0) {
      for (let i = 0; i < satellite.passes.length; i++) {
        if (satellite.passes[i].duration < 10) {
          satellite.splice(i, 1);
          i--;
        }
      }
      setStartVisibility(unixToDate(satellite.passes[0].startUTC));
      setEndVisibility(unixToDate(satellite.passes[0].endUTC));
      setDirection(satellite.passes[0].startAzCompass);
      setDurationSat(satellite.passes[0].duration);
    }
  }, [satellite]);

  useEffect(() => {
    if (location.loaded != false) {
      setLat(location.coordinates.lat);
      setLong(location.coordinates.lng);
    }
  }, [location]);

  useEffect(() => {
    axios
      .get(
        `/satellite/25544/${lat}/${long}/0/1/0/`
      )
      .then((res) => {
        setSatellite(res.data);
      });
  }, [lat || long]);

  return (
    <div className="App">
      <header className="App-header">
        {location.loaded ? (
          <div>
            <h1>Le prochain passage de l'ISS dans votre ciel</h1>
            <h2>À partir du : {startVisibility}</h2>
            <h2>Jusqu'à : {endVisibility}</h2>
            <h2>Dans cette direction: {direction}</h2>
            <h2>Pendant {durationSat} secondes</h2>{" "}
          </div>
        ) : (
          <h1>Veuillez activer la localisation</h1>
        )}
      </header>
    </div>
  );
}

export default App;
