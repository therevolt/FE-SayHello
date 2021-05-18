import React from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyC-aQLjWEi_mmOWl0l1Y5_X9TMTi776NNo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div className="mx-4" style={{ height: `200px`, width: "300px" }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap defaultZoom={8} defaultCenter={{ lat: -6.7644728, lng: 106.779242 }}>
    {props.isMarkerShown && <Marker position={{ lat: -6.7644728, lng: 106.779242 }} />}
  </GoogleMap>
));

export default MyMapComponent;
// ReactDOM.render(<MyMapComponent isMarkerShown />, document.getElementById("root"));
