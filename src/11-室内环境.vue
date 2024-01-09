<template>
  <div class="app">
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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

  new RGBELoader().load(
    "../src/model/other/royal_esplanade_1k.hdr",
    function (texture) {
      // 等距圆柱投影的环境贴图，也被叫做经纬线映射贴图
      texture.mapping = THREE.EquirectangularReflectionMapping;

      scene.background = texture;
      // 纹理贴图将会被设为场景中所有物理材质的环境贴图
      scene.environment = texture;

      render();
      new GLTFLoader().load(
        "../src/model/damagedHelmet/DamagedHelmet.gltf",
        function (gltf) {
          scene.add(gltf.scene);

          render();
        }
      );
    }
  );

  // 相机
  camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 20);
  camera.position.set(-1.8, 0.6, 2.7);

  // 坐标辅助对象
  axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);

  // 渲染器
  //antialias - 是否执行抗锯齿。默认为false.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(canvasWidth, canvasHeight);
  // 色调映射
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.addEventListener("change", render);
  // 最大最小缩放
  cameraControls.minDistance = 2;
  cameraControls.maxDistance = 10;
  cameraControls.target.set(0, 0, -0.2);
  cameraControls.update();
}
function render() {
  renderer.render(scene, camera);
  // requestAnimationFrame(render);
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
