import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });

renderer.setClearAlpha(0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer));

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const loader = new GLTFLoader();

loader.load(
  'bat.glb',
  function (gltf) {
    const bat = gltf.scene;

    bat.position.set(0, -0.5, -1.5);
    
    bat.scale.set(0.5, 0.5, 0.5);
    
    bat.rotation.y = Math.PI + Math.PI / 2; 

    scene.add(bat);
  },
  undefined,
  function (error) {
    console.error('An error happened while loading the model:', error);
  }
);

renderer.setAnimationLoop(function () {
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});