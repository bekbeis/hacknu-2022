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

// const coordinates = [
//   { lat: 52.37190746, lng: 4.90526689, alt: -1.398195427 },
//   { lat: 52.37143359, lng: 4.904098515, alt: -1.308533509 },
//   { lat: 52.37130446, lng: 4.903811829, alt: -0.011311007 },
//   { lat: 52.37110056, lng: 4.904112411, alt: -0.435420848 },
//   { lat: 52.37088764, lng: 4.904277296, alt: 0.847999422 }
// ];

const coordinates = [
  [
    [-95.364041,29.756421],
    [-95.361471,29.754867],
    [-95.360633,29.754379],
    [-95.361213,29.753626],
    [-95.362074,29.754120],
    [-95.363759,29.755176],
    [-95.364355,29.754418],
    [-95.366974,29.756010],
    [-95.364622,29.758971],
    [-95.363733,29.758421],
    [-95.362881,29.757926]
  ],
  [
    [-95.362849,29.754704],
    [-95.361736,29.756131],
    [-95.360893,29.755613],
    [-95.361472,29.754875],
    [-95.362082,29.754121],
    [-95.362646,29.753394],
    [-95.363498,29.753894],
    [-95.362908,29.754629]
  ],
  [
    [-95.362674,29.754930],
    [-95.361736,29.756131],
    [-95.360893,29.755613],
    [-95.361472,29.754875],
    [-95.362082,29.754121],
    [-95.362646,29.753394],
    [-95.363498,29.753894]
  ],
  [
    [-95.363177,29.755911],
    [-95.362588,29.756656],
    [-95.364287,29.757660],
    [-95.364862,29.756939],
    [-95.365483,29.756174],
    [-95.364640,29.755656],
    [-95.363757,29.755162]
  ],
  [
    [-95.362588,29.756656],
    [-95.364287,29.757660],
    [-95.364862,29.756939],
    [-95.365483,29.756174],
    [-95.364640,29.755656],
    [-95.363757,29.755162],
    [-95.363177,29.755911]
  ],
  [
    [-95.366660,29.754684],
    [-95.366058,29.755443],
    [-95.366172,29.755509],
    [-95.366763,29.754746]
  ],
  [
    [-95.365637,29.756273],
    [-95.367251,29.757255],
    [-95.367834,29.756522],
    [-95.367405,29.756257],
    [-95.367834,29.756522],
    [-95.367251,29.757255]
  ]
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
  webGLOverlayView.onDraw = ({gl, transformer}) => {
    // update camera matrix to ensure the model is georeferenced correctly on the map
    
    
    console.log("Count");

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