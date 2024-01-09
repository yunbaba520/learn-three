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

init();
render();
function init() {
  // 场景
  scene = new THREE.Scene();
  // 模型
  addModel();
  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    3000
  );
  camera.position.set(0, 0, -1);
  // camera.lookAt(0, 0, 0);
  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.minDistance = 2;
  cameraControls.maxDistance = 10;
  // cameraControls.addEventListener("change", render);
  // cameraControls.target.set(0, 0, 0);
  // cameraControls.update();
}
function addModel() {
  // 几何体
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  // 材质
  const imgs = ["4_l", "4_r", "4_u", "4_d", "4_b", "4_f"];

  const textureLoader = new THREE.TextureLoader();
  const materialArr = imgs.map((item) => {
    const texture = textureLoader.load(`../src/assets/img/room/${item}.jpg`);
    // const texture = textureLoader.load(`../src/assets/img/work/${item}.jpg`);
    if (item === "4_u" || item === "4_d") {
      texture.rotation = Math.PI;
      texture.center = new THREE.Vector2(0.5, 0.5);
    }
    return new THREE.MeshBasicMaterial({ map: texture });
  });
  // 模型
  const cube = new THREE.Mesh(geometry, materialArr);
  cube.geometry.scale(1, 1, -1);
  scene.add(cube);
}
function render() {
  renderer.render(scene, camera);
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
