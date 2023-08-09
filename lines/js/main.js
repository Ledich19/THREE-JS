import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Perlin from './lib/Perlin.js';

let size = 20;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 0, 200);
scene.position.set(-100, -100, 0);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//------
const groupX = new THREE.Group();
const groupY = new THREE.Group();
scene.add(groupX);
scene.add(groupY);

//-----
const material1 = new THREE.LineBasicMaterial({ color: 0x00ff00 });
let points1 = [];
let points2 = [];
for (let j = 0; j < size; j++) {
  points1 = [];
  points2 = [];
  for (let i = 0; i < size; i++) {
    points1.push(new THREE.Vector3(i * 10, j * 10, 1));
  }
  for (let i = 0; i < size; i++) {
    points2.push(new THREE.Vector3(j * 10, i * 10, 1));
  }
  const geometry1 = new THREE.BufferGeometry().setFromPoints(points1);
  const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

  let mesh1 = new THREE.Line(geometry1, material1);
  let mesh2 = new THREE.Line(geometry2, material1);
  groupX.add(mesh1);
  groupY.add(mesh2);
}

console.log(groupX.children[1].geometry.attributes.position);
//-----
const UpdateGrid = (time) => {
  for (let i = 0; i < size; i++) {
    let lineX = groupX.children[i];
    let lineY = groupY.children[i];
    let vecX = lineX.geometry.attributes.position;
    let vecY = lineY.geometry.attributes.position;
    for (let j = 0; j < size; j++) {
      //console.log(vecX.getX(j));
      vecX.setXYZ(
        j,
        vecX.getX(j),
        vecX.getY(j),
        100 * Perlin(vecX.getX(j) / 100, vecX.getY(j) / 100, time / 100)
      );
      vecY.setXYZ(
        j,
        vecY.getX(j),
        vecY.getY(j),
        100 * Perlin(vecY.getX(j) / 100, vecY.getY(j) / 100, time / 100)
      );
    }
    vecX.needsUpdate = true;
    vecY.needsUpdate = true;
  }
};
let time = 0;
function animate() {
  time++;
  requestAnimationFrame(animate);
  UpdateGrid(time);
  renderer.render(scene, camera);
}

animate();
