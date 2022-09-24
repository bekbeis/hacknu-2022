import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {apiOptions, mapOptions, data} from './data.js';

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
  let scene, renderer, camera, loader, mixer;
  const clock = new THREE.Clock();
  const webGLOverlayView = new google.maps.WebGLOverlayView();
  
  webGLOverlayView.onAdd = () => {   
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
      
    loader = new GLTFLoader();        
    const source = "stegosaurs_SStenops.glb";
    loader.load(
      source,
      gltf => {
        gltf.scene.scale.set(1,1,1);
        gltf.scene.rotation.x = 90 * Math.PI/180;
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
    renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas,
      context: gl,
      ...gl.getContextAttributes(),
    });
    renderer.autoClear = false;
    
    loader.manager.onLoad = () => {        
      renderer.setAnimationLoop(() => {});
    }
  }

  let latLngAltitudeLiteral = {
    lat: mapOptions.center.lat,
    lng: mapOptions.center.lng,
    altitude: 0
  };
  
  var t = 0, dt = 0.001,
      a = data[0],
      b = data[1],
      i = 1;

  const ease = (t) => (t<0.5 ? 2*t*t : -1+(4-2*t)*t);
  const lerp = (a,b,t) => (a+(b-a)*t);

  webGLOverlayView.onDraw = ({gl, transformer}) => {

    var newLat = lerp(a.Latitude, b.Latitude, ease(t));
    var newLng = lerp(a.Longitude, b.Longitude, ease(t));
    var newAlt = lerp(a.Altitude, b.Altitude, ease(t));

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
    renderer.resetState();
  }
  webGLOverlayView.setMap(map);
}

(async () => {        
  const map = await initMap();
  initWebGLOverlayView(map);
})();