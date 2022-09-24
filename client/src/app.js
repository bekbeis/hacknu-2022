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
  "center": { lat: 37.8123988, lng: -122.3626517 },
  "mapId": "ca8e921ae1e995d0"    
};

const coordinates = [
  { lat: 37.8123988, lng: -122.3626517, alt: 58.43987247 },
  { lat: 52.37143359, lng: 4.904098515, alt: -1.308533509 },
  { lat: 52.37130446, lng: 4.903811829, alt: -0.011311007 },
  { lat: 52.37110056, lng: 4.904112411, alt: -0.435420848 },
  { lat: 37.8123988, lng: -122.3626517, alt: 6.163646818 }
];
  
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
  let mixer;
  const clock = new THREE.Clock();

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
    const source = "stegosaurs_SStenops.glb";
    loader.load(
      source,
      gltf => {      
        gltf.scene.scale.set(5,5,5);
        gltf.scene.rotation.x = 90 * Math.PI/180; // rotations are in radians
                 
        
        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, 'walk1');
        const action = mixer.clipAction(clip);
        action.play();

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
        // map.moveCamera({
        //   "tilt": mapOptions.tilt,
        //   "heading": mapOptions.heading,
        //   "zoom": mapOptions.zoom
        // });      
        
        // // rotate the map 360 degrees 
        // if (mapOptions.tilt < 67.5) {
        //   mapOptions.tilt += 0.5
        // } else if (mapOptions.heading <= 360) {
        //   mapOptions.heading += 0.2;
        // } else {
        //   renderer.setAnimationLoop(null)
        // }
      });        
    }
  }

  let latLngAltitudeLiteral = {
    lat: mapOptions.center.lat,
    lng: mapOptions.center.lng,
    altitude: 0
  };

  const lerp = (a, b, t) => (a + (b-a) * t);
  var t = 0, dt = 0.02,
      a = coordinates[0],
      b = coordinates[4];
  const ease = (t) => (t<0.5 ? 2*t*t : -1+(4-2*t)*t);

  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    var newLat = lerp(a.lat, b.lat, ease(t));
    var newLng = lerp(a.lng, b.lng, ease(t));
    var newAlt = lerp(a.alt, b.alt, ease(t));
    latLngAltitudeLiteral = {
      lat: newLat,
      lng: newLng,
      altitude: newAlt
    };
    t += dt;
    if (t <= 0 || t >= 1)
        dt = -dt;

    const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
    camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
    
    if (mixer)
      mixer.update(clock.getDelta());

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