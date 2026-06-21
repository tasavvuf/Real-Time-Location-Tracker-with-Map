import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
  const socket = io('http://localhost:3000');

function App() {
  const [postion, setPostion] = useState([0,0])
  socket.on('connect', () => {
    console.log('Connected to server',socket.id);
  });
  useEffect(() => {
    if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      setPostion([position.coords.latitude, position.coords.longitude])
      socket.emit('send-location', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    }, (error) => {
      console.error(error)
    }, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  }
  }, []);

  return (
    <div>


      <MapContainer center={postion} zoom={13} scrollWheelZoom={true} style={{ height: "100vh", width: "100%" }}>
  <TileLayer
    attribution='tevindustries'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={postion}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>



</div>
  )
}

export default App