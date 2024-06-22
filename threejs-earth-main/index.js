// https://planetpixelemporium.com/

import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
import { getFresnelMat } from "./src/getFresnelMat.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
scene.add(earthGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader = new THREE.TextureLoader();
const geo = new THREE.IcosahedronGeometry(2.0, 12);
const mat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/00_earthmap1k.jpg"),
});
const earthMesh = new THREE.Mesh(geo, mat);
earthGroup.add(earthMesh);

const lightsMat = new THREE.MeshStandardMaterial({
  // color: 0x00ff00,
  // transparent: true,
  // opacity: 0.6
  map: loader.load("./textures/03_earthlights1k.jpg"),
  blending: THREE.AdditiveBlending,
});
const lightsMesh = new THREE.Mesh(geo, lightsMat, 12);
earthGroup.add(lightsMesh);

const cloudsMat = new THREE.MeshStandardMaterial({
  map: loader.load("./textures/04_earthcloudmap.jpg"),
  transparent: true,
  opacity: 0.8,
  blending: THREE.AdditiveBlending,
  alphaMap: loader.load("./textures/05_earthcloudmaptrans.jpg"),
});
const cloudsMesh = new THREE.Mesh(geo, cloudsMat);
cloudsMesh.scale.setScalar(1.003);
earthGroup.add(cloudsMesh);

const fresnelMat = getFresnelMat();
const glowMesh = new THREE.Mesh(geo, fresnelMat);
glowMesh.scale.setScalar(1.01);
earthGroup.add(glowMesh);

const stars = getStarfield({ numStars: 2000 });
scene.add(stars);

const sunLight = new THREE.DirectionalLight(0xffffff);
sunLight.position.set(-2, 0.5, 1.5);
scene.add(sunLight);

const animate = (t = 0) => {
  requestAnimationFrame(animate);
  earthMesh.rotation.y = t * 0.0001;
  lightsMesh.rotation.y = t * 0.0001;
  cloudsMesh.rotation.y = t * 0.00013;
  renderer.render(scene, camera);
  controls.update();
};

animate();
