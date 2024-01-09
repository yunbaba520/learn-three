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
var l = 60; //波动距离
var s = 1; // 缩放倍数
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
  const g = new THREE.PlaneGeometry(2, 1);
  g.translate(-1, 0, 0);

  const m = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    map: new THREE.TextureLoader().load("../src/assets/img/信号波.png"),
    side: THREE.DoubleSide,
    transparent: true,
  });
  mesh = new THREE.Mesh(g, m);
  console.log(mesh);
  scene.add(mesh);
}

function render() {
  renderer.render(scene, camera);
  s += 0.6;
  mesh.scale.set(s, s, s);
  if (s <= l * 0.2) {
    mesh.material.opacity = (s - 1) / (l * 0.2 - 1); //保证透明度在0~1之间变化
  } else if (s > l * 0.2 && s <= l) {
    mesh.material.opacity = 1 - (s - l * 0.2) / (l - l * 0.2); //保证透明度在0~1之间变化
  } else {
    s = 1.0;
  }

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
