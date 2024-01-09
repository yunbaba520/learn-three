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
  texture = new THREE.TextureLoader().load("../src/assets/img/纹理箭头.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // 决定纹理在表面的重复次数,大于1需要设置上面两个
  texture.repeat.set(20, 1);

  var g = new THREE.PlaneGeometry(200, 10);

  var m = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    map: texture,
    transparent: true,
    // opacity: 0.8,
    side: THREE.DoubleSide,
  });
  var mesh = new THREE.Mesh(g, m);
  mesh.position.set(120, 50, 0);
  scene.add(mesh);
}
function render() {
  renderer.render(scene, camera);
  texture.offset.x -= 0.02;
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
