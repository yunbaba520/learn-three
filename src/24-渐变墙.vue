<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let scene;
let camera;
let renderer;
let axesHelper;
let cameraControls;

let texture;
init();
render();
function init() {
  // 场景
  scene = new THREE.Scene();

  // 相机
  camera = new THREE.PerspectiveCamera(
    45,
    canvasWidth / canvasHeight,
    1,
    10000
  );
  camera.position.set(0, 0, 350);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function addModel() {
  const geometry = new THREE.PlaneGeometry(150, 30);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00dfdf,
    transparent: true,
    side: THREE.DoubleSide, //两面可见
    map: new THREE.TextureLoader().load("../src/assets/img/渐变墙-墙体.png"),
  });
  const plane = new THREE.Mesh(geometry, material);
  scene.add(plane);

  texture = new THREE.TextureLoader().load("../src/assets/img/渐变墙.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = 2; // x方向阵列
  var plane2 = plane.clone();
  plane2.material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    map: texture,
    transparent: true,
    side: THREE.DoubleSide, //两面可见
  });
  scene.add(plane2);
}

function render() {
  renderer.render(scene, camera);
  texture.offset.y += 0.005;
  requestAnimationFrame(render);
}
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
}
</style>
