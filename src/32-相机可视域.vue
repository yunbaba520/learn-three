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
  camera.position.set(0, 0, 600);
  camera.lookAt(0, 0, 0);

  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
  add();
}
function add() {
  const geometry = new THREE.ConeGeometry(20, 70, 4);
  geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, -35, 0));
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
  });
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.rotateX(Math.PI / 2);
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
}
</style>
