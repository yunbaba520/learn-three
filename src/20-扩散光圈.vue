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
// 光圈大小在1~2.5倍之间变化
let _s = 2.5;
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
  camera.position.set(600, 600, 600);
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
  const g = new THREE.PlaneGeometry(100, 100);
  const texture = new THREE.TextureLoader().load(
    "../src/assets/img/扩散光圈.png"
  );
  const m = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  mesh = new THREE.Mesh(g, m);
  mesh.rotateX(-Math.PI / 2);
  scene.add(mesh);
}

function render() {
  _s += 0.01;
  mesh.scale.set(_s, _s, _s);
  if (_s <= 1.3) {
    mesh.material.opacity = (_s - 1.0) * 3.3; //3.3约等于1/(1.3-1.0)，保证透明度在0~1之间变化
  } else if (_s > 1.3 && _s <= 2.5) {
    mesh.material.opacity = 1 - (_s - 1) / 1.5; //缩放2.5对应0 缩放1.0对应1
  } else {
    _s = 1.0;
  }

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
