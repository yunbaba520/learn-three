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
  camera.position.set(300, 300, 300);
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
  // 底图
  const g = new THREE.PlaneGeometry(50, 50);
  const texture = new THREE.TextureLoader().load(
    "../src/assets/img/雷达扫描-底图.png"
  );
  const m = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    depthTest: false, //是否在渲染此材质时启用深度测试
  });
  const baseMesh = new THREE.Mesh(g, m);
  baseMesh.rotateX(-Math.PI / 2);
  scene.add(baseMesh);

  // 光
  const texture2 = new THREE.TextureLoader().load(
    "../src/assets/img/雷达扫描-光波.png"
  );
  const m2 = new THREE.MeshBasicMaterial({
    map: texture2,
    side: THREE.DoubleSide,
    color: 0x00ffff,
    transparent: true,
    opacity: 0.6,
    depthTest: false,
  });
  mesh = new THREE.Mesh(g, m2);
  // mesh.position.set(0, 10, 0);
  baseMesh.add(mesh);
}

function render() {
  renderer.render(scene, camera);
  mesh.rotateZ(0.02);
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
