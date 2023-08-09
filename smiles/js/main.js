import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { gsap } from "gsap"
import { Timeline } from "gsap"

let size = 100;
var material;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 1);
scene.position.set(0, 0, 0);
camera.lookAt(0, 0, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

//------
const groupX = new THREE.Group();
const groupY = new THREE.Group();
scene.add(groupX);
scene.add(groupY);

material = new THREE.ShaderMaterial({
  wireframe: true,
  extensions: {
    derivatives: "#extension GL_OES_standard_derivatives : enable",
  },
  uniforms: {
    time: { time: "f", value: 0.3 },
    blend: { time: "f", value: 0.0 },
    original: {
      type: "t",
      value: new THREE.TextureLoader().load("../assets/img/tounge.png"),
    },
    cry: {
      type: "t",
      value: new THREE.TextureLoader().load("../assets/img/cry.png"),
    },
  },
  vertexShader: document.getElementById("vertShader").textContent,
  fragmentShader: document.getElementById("fragShader").textContent,
  side: THREE.DoubleSide,
  transparent: true,
});

const geometry = new THREE.PlaneGeometry(1, 1,size,size);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
//-----------------------------------

let h = window.innerHeight;
let w = window.innerWidth;
scene.destination = {x:0,y:0}
const mouseMove = (e) =>{
  let x = (e.clientX - w/2)/(w/2)
  let y = (e.clientY - h/2)/(h/2)
  scene.destination.x = x*0.5
  scene.destination.y = y*0.5
  }
  document.addEventListener('mousemove', mouseMove)
  
  let time = 0;
  function animate() {
    time++;
    material.uniforms.time.value = time;
    scene.rotation.x += (scene.destination.x - scene.rotation.x) * 0.05;
    scene.rotation.y += (scene.destination.y - scene.rotation.y) * 0.05;

    //UpdatePlay(time);
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

animate();
let tl = gsap.timeline({ paused: true });
tl.to(material.uniforms.blend, {
  duration: 2.5,
  ease: "elastic.out(1, 0.3)",
  value: 1,
  delay: 0
});


document.querySelector("body").addEventListener("click", (e) => {
  if (e.target.classList.contains("done")) {
    console.log("done");
    tl.reverse();
    e.target.classList.remove("done");
  } else {
    console.log("updone");
    tl.play();
    e.target.classList.add("done");
  }
});
