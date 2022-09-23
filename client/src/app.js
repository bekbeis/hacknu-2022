import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const apiOptions = {
  apiKey: 'AIzaSyD6Iizn9Jsf5b69Hghc8TJLc1KqK0Z3BX0',
  version: "beta"
};

const mapOptions = {
  "tilt": 0,
  "heading": 0,
  "zoom": 18,
  "center": { lat: 35.6594945, lng: 139.6999859 },
  "mapId": "ca8e921ae1e995d0"    
};
  
async function initMap() {    
  const mapDiv = document.getElementById("map");
  const apiLoader = new Loader(apiOptions);
  await apiLoader.load();
  const map = new google.maps.Map(mapDiv, mapOptions);

  const buttons = [
    ["Rotate Left", "rotate", 20, google.maps.ControlPosition.LEFT_CENTER],
    ["Rotate Right", "rotate", -20, google.maps.ControlPosition.RIGHT_CENTER],
    ["Tilt Down", "tilt", 20, google.maps.ControlPosition.TOP_CENTER],
    ["Tilt Up", "tilt", -20, google.maps.ControlPosition.BOTTOM_CENTER],
  ];

  buttons.forEach(([text, mode, amount, position]) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");
  
    controlUI.classList.add("ui-button");
    controlUI.innerText = `${text}`;
    controlUI.addEventListener("click", () => {
      adjustMap(mode, amount);
    });
    controlDiv.appendChild(controlUI);
    map.controls[position].push(controlDiv);
  });

  const adjustMap = function (mode, amount) {
    switch (mode) {
      case "tilt":
        map.setTilt(map.getTilt() + amount);
        break;
      case "rotate":
        map.setHeading(map.getHeading() + amount);
        break;
      default:
        break;
    }
  };

  return map;
};






function initWebGLOverlayView(map) {  
  let scene, renderer, camera, loader;
  const webGLOverlayView = new google.maps.WebGLOverlayView();
  
  webGLOverlayView.onAdd = () => {   
    // set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
  
    // load the model    
    loader = new GLTFLoader();               
    const source = "shiba.glb";
    loader.load(
      source,
      gltf => {      
        gltf.scene.scale.set(50,50,50);
        gltf.scene.rotation.x = 90 * Math.PI/180; // rotations are in radians
        scene.add(gltf.scene);           
      }
    );
  }
  
  webGLOverlayView.onContextRestored = ({gl}) => {    
    // create the three.js renderer, using the
    // maps's WebGL rendering context.
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;

    // wait to move the camera until the 3D model loads    
    loader.manager.onLoad = () => {        
      renderer.setAnimationLoop(() => {
        map.moveCamera({
          "tilt": mapOptions.tilt,
          "heading": mapOptions.heading,
          "zoom": mapOptions.zoom
        });            
        
        // rotate the map 360 degrees 
        if (mapOptions.tilt < 67.5) {
          mapOptions.tilt += 0.5
        } else if (mapOptions.heading <= 360) {
          mapOptions.heading += 0.2;
        } else {
          renderer.setAnimationLoop(null)
        }
      });        
    }
  }

  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    const latLngAltitudeLiteral = {
        lat: mapOptions.center.lat,
        lng: mapOptions.center.lng,
        altitude: 50
    }

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    
    webGLOverlayView.requestRedraw();      
    renderer.render(scene, camera);                  

    // always reset the GL state
    renderer.resetState();
  }
  webGLOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);    
})();