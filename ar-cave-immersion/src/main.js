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

//tentando usar raycast

const raycaster = new THREE.Raycaster();

// ###### SETUP DO CANVAS

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = "black";
ctx.font = "48px Arial";
ctx.fillText("Fala papai", 50, 100);

const textura = new THREE.CanvasTexture(canvas);

const g1 = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshStandardMaterial({map: textura});
const cubo = new THREE.Mesh(g1, mat);
cubo.position.set(0.0, 0.0, -3.5);

//scene.add(cubo);





//####### SETUP DO CANVAS




const loader = new GLTFLoader();

function checkIntersection(pointer)
{
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0)
  {
    intersects[0].object.material.color.set(0xff0000);
  }
}


renderer.domElement.addEventListener("click", (event) => {

  const x = (event.clientX / window.innerWidth) * 2 - 1;
  const y = -(event.clientY / window.innerHeight) * 2 + 1;

  const pointer = new THREE.Vector2(x, y);

  checkIntersection(pointer);
})



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


//tentando atualizar o canvas a cada 2seg
setInterval(() => {
  //ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
  //ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "60px Arial";
  ctx.fillText("pega2", 50, 300);

  textura.needsUpdate = true;

}, 2000);

renderer.setAnimationLoop(function () {
  renderer.render(scene, camera);
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});