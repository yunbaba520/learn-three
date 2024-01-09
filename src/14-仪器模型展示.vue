<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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
  camera.position.set(0, 0, 300);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  const light1 = new THREE.PointLight(0xffffff, 300000);
  light1.position.set(300, 200, 200);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xffffff, 300000);
  light2.position.set(-300, -200, -200);
  scene.add(light2);
  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
  console.log(scene);
  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasWidth, canvasHeight);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
}

function addModel() {
  // const geometry = new THREE.BoxGeometry(100, 100, 100);
  // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.set(300, 0, 0);
  // scene.add(cube);
  new GLTFLoader().load(
    "../src/model/YiQi/YiQi.gltf",
    function (gltf) {
      scene.add(gltf.scene.children[0]);
    },
    function () {
      console.log("加载中");
    },
    function (error) {
      console.error(error);
    }
  );
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
