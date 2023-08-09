import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Perlin from './lib/Perlin.js';

let size = 50;


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 600);
scene.position.set(-100, -100, 0);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//------
const groupX = new THREE.Group();
const groupY = new THREE.Group();
scene.add(groupX);
scene.add(groupY);

//-----------------------------------
const material = new THREE.ShaderMaterial({
 // wireframe: true,
  extensions: {
    derivatives: '#extension GL_OES_standard_derivatives : enable',
  },
  uniforms: {
    time: { time: 'f', value: 0.3 },
  },
  vertexShader: document.getElementById('vertShader').textContent,
  fragmentShader: document.getElementById('fragShader').textContent,
  side: THREE.DoubleSide,
  transparent: true,
});
const geometry = new THREE.PlaneGeometry(600, 600, size, size);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//-----------------------------------
const position = geometry.attributes.position;
const UpdatePlay = (time) => {
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i);
    const y = position.getY(i);
    const z = position.getZ(i);
    position.setXYZ(i, x, y, 100 * Perlin(x / 100, y / 100, time / 100));
  }
  position.needsUpdate = true;
};

let time = 0;
function animate() {
  time++;
  requestAnimationFrame(animate);
  //UpdatePlay(time);
  renderer.render(scene, camera);
}

animate();
