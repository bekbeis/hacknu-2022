import { Loader } from '@googlemaps/js-api-loader';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {apiOptions, mapOptions, data} from './data.js';
import {drawPath} from './path.js'
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
  let scene, renderer, camera, loader, mixer, randcolor;
  const clock = new THREE.Clock();
  const webGLOverlayView = new google.maps.WebGLOverlayView();
  function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}
//making sphere
var geometry = new THREE.SphereGeometry(1, 32, 16);

const material = new THREE.MeshPhongMaterial({
  color: 0xffff00,
  opacity: 0.5,
  transparent: true,
});
const sphere = new THREE.Mesh(geometry, material);
// -------------
  webGLOverlayView.onAdd = () => {   
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();
    const ambientLight = new THREE.AmbientLight( 0xffffff, 2 ); // soft white light
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0.5, -1, 0.5);
    scene.add(directionalLight);
    randcolor = random_rgba();

     // load the model
    var activity = "walking";
    if (activity === "walking" || null) {
      loader = new GLTFLoader();
      const source = "./models/girl__character_walk.glb";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians

        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
        const action = mixer.clipAction(clip);
        //console.log(clips);
        action.play();

        scene.add(gltf.scene);
      });
    } else if (activity === "running") {
      loader = new GLTFLoader();
      const source = "./models/run.glb";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians

        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
        const action = mixer.clipAction(clip);
        // console.log(clips);
        action.play();

scene.add(gltf.scene);
      });
    } else if (activity === "driving") {
      loader = new GLTFLoader();
      const source = "./models/alfa_romeo_stradale_1967.glb";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(30, 30, 30);
        gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians

        scene.add(gltf.scene);
      });
    } else if (activity === "cycling") {
      loader = new GLTFLoader();
      const source = "./models/jo_on_bike.glb";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians

        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, "M_rig_Action_S");
        const action = mixer.clipAction(clip);
        // console.log(clips);
        action.play();

        scene.add(gltf.scene);
      });
    } else if (activity === "swimming") {
      loader = new GLTFLoader();
      const source = "./models/swimming_ool.glb";
      loader.load(source, (gltf) => {
        gltf.scene.scale.set(5, 5, 5);
        gltf.scene.rotation.x = (90 * Math.PI) / 180; // rotations are in radians

        mixer = new THREE.AnimationMixer(gltf.scene);
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, "mixamo.com");
        const action = mixer.clipAction(clip);
        // console.log(clips);
        action.play();

        scene.add(gltf.scene);
      });
    }

    // ------
    scene.add(sphere);
    // ------
  };
  
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
  var idx = 0;
  webGLOverlayView.onDraw = ({gl, transformer}) => {
    sphere.scale.set(
      (sphere.scale.x = data[idx]["Horizontal accuracy"]),
      (sphere.scale.y = data[idx]["Vertical accuracy"]),
      (sphere.scale.z = data[idx]["Horizontal accuracy"])
    );
    idx = idx < data.length - 1 ? idx + 1 : 0;
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