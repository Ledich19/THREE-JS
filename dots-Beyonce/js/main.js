import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import fragShader from "./shaders/fragShader.frag";
import vertShader from "./shaders/vertShader.vert";

let size = 100;
var material, pointsMesh;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 350);
scene.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
const raycaster = new THREE.Raycaster();

const pointer = new THREE.Vector2();

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener("pointermove", onPointerMove);

//------
const groupX = new THREE.Group();
const groupY = new THREE.Group();
scene.add(groupX);
scene.add(groupY);

material = new THREE.ShaderMaterial({
  //wireframe: true,
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable",
  },
  uniforms: {
    time: { time: "f", value: 0.3 },
    mousePos: { time: "v3", value: new THREE.Vector3(0, 0, 0) },
    blend: { time: "f", value: 0.0 },
    pixels: {
      time: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
  },
  vertexShader: vertShader,
  fragmentShader: fragShader,
  side: THREE.DoubleSide,
  //transparent: true,
});

new GLTFLoader().load(
  "../assets/models3D/beyonce-30k.glb",
  (gltf) => {
    let geo = new THREE.BufferGeometry();
    let pos = gltf.scene.children[0].geometry.attributes.position.array;
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.computeBoundingBox();
    pointsMesh = new THREE.Points(geo, material);
    scene.add(pointsMesh);
  },
  undefined,
);

const geometry = new THREE.PlaneGeometry(100, 600, size, size);
const mesh = new THREE.Mesh(
  geometry,
  new THREE.MeshBasicMaterial({ color: 0xffff00, visible: false })
);
scene.add(mesh);
//-----------------------------------

let time = 0;
function animate() {
  time += 0.05;
  material.uniforms.time.value = time;
  if (pointsMesh) {
    pointsMesh.rotation.y += 0.005;
  }
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects([mesh]);
  if (intersects.length > 0) {
    material.uniforms.mousePos.value = intersects[0].point;
  }
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();
