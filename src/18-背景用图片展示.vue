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

let mesh;

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
  camera.position.set(400, 400, 400);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({
    alpha: true,
  });
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function addModel() {
  const g = new THREE.BoxGeometry(50, 200, 50);
  const m = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
  });
  const mesh = new THREE.Mesh(g, m);
  scene.add(mesh);
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
  background: url("./assets/img/icon.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>
