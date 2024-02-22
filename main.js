import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';


const dotHoverStyle = new Style({
  image: new CircleStyle({
    
    radius: 5, // Adjust the radius as needed
    fill: new Fill({
      color: 'rgba(255, 165, 0, 0.6)', // Orange fill
    }),
    stroke: new Stroke({
      color: 'rgba(255, 100, 0, 0.7)',
      width: 2,
    }),
  }),
});


const map = new Map({
  target: 'map-container',
  layers: [
    /*new VectorLayer({
      source: new VectorSource({
        format: new GeoJSON(),
        url: './data/areas.geojson',
        name: 'areas'
      }),
    }),*/
    new VectorLayer({
        source: new VectorSource({
            format: new GeoJSON(),
            url: './data/bounds.geojson',
            name: 'bounds'
        }),
    }),
    new VectorLayer({
      source: new VectorSource({
          format: new GeoJSON(),
          url: './data/grocery.geojson',
          name: 'grocery'
          // Add style for grocery layer here if needed
      }),
    }),
  ],
  view: new View({
    center: [-9750000, 5133000],
    zoom: 10.8,
  }),
});
const info = document.getElementById('status'); // Make sure this matches the ID of your  display element

let currentFeature;


let currentFeature2;
const displayFeatureInfoStore = function (pixel, target) {
  const feature = target.closest('.ol-control')
    ? undefined
    : map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

  if (feature) {
    info.style.left = pixel[0] + 'px';
    info.style.top = pixel[1]  + 'px';
    //info.style.bottom = pixel[1] - 20 + 'px';
    console.log(info.style.top);
    console.log(info.style.bottom);
    if (feature !== currentFeature2) {
      info.style.visibility = 'visible';
      info.innerText = feature.get('store_name');
      info.style.color = 'blue';
      info.style.backgroundColor = 'transparent';
      info.style.outline = 'blue';
       
      console.log(info.innerText);
      if (info.innerText === 'undefined'){
        info.innerText = feature.get('community');
      }
      
    }
  } else {
    info.style.visibility = 'hidden';
  }
  currentFeature2 = feature;
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    info.style.visibility = 'hidden';
    currentFeature = undefined;
    return;
  }
  const pixel = map.getEventPixel(evt.originalEvent);
  /*map.forEachLayerAtPixel(pixel, function(layer) {
    if (layer instanceof VectorLayer) {
      const layerName = layer.get('name'); // Retrieve the custom name property
      if (layerName == 'grocery') {
        displayFeatureInfo(pixel, evt.originalEvent.target);
      }
    }
  });*/
  
  //displayFeatureInfo(pixel, evt.originalEvent.target);
  displayFeatureInfoStore(pixel, evt.originalEvent.target);
});

map.on('click', function (evt) {
  displayFeatureInfoStore(evt.pixel, evt.originalEvent.target);
});

map.getTargetElement().addEventListener('pointerleave', function () {
  currentFeature = undefined;
  info.style.visibility = 'hidden';
});








