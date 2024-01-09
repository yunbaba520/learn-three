<template>
  <div class="app">
    <div class="btns">
      <button @click="changeColor">改变颜色</button>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 高光
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let model = null;

// 场景
const scene = new THREE.Scene();
// 模型
const loader = new GLTFLoader();
loader.load(
  "../src/model/factory/工厂.gltf",
  function (gltf) {
    console.log("控制台查看加载gltf文件返回的对象结构", gltf);
    model = gltf;
    // console.log('gltf对象场景属性',gltf.scene);
    // 返回的场景对象gltf.scene插入到threejs场景中
    scene.add(gltf.scene);
  },
  function (val) {
    // 加载一部分，就调用函数，可做模型加载进度条
    // console.log(val);
  },
  function (err) {
    console.log(err);
  }
);

// 相机
const camera = new THREE.PerspectiveCamera(
  75,
  canvasWidth / canvasHeight,
  0.1,
  3000
);
camera.position.set(-84, 78, 1.3);
camera.lookAt(0, 0, 0);
// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.decay = 0.0; //光源光照强度不随距离改变衰减

pointLight.position.set(-100, 190, 110);
scene.add(pointLight);
// console.log(pointLight);
// 坐标辅助对象
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
// 渲染帧率
const stats = new Stats();
document.body.appendChild(stats.domElement);
// 渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvasWidth, canvasHeight);
// 高光
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const outlinePass = new OutlinePass(
  new THREE.Vector2(canvasWidth, canvasHeight),
  scene,
  camera
);
composer.addPass(renderPass);
composer.addPass(outlinePass);

// 动画渲染循环
function animate() {
  stats.update();
  // renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener("change", function () {
  // renderer.render(scene, camera); //执行渲染操作
});
cameraControls.target.set(0, 0, 0);
cameraControls.maxPolarAngle = Math.PI / 2; // 相机不能进入地下
// 可视化控制器
const gui = new GUI();
const lightFolder = gui.addFolder("点光源");

lightFolder
  .add(pointLight.position, "x", -200, 200)
  .name("x轴")
  .onChange((value) => {
    pointLight.position.x = value;
  });
lightFolder
  .add(pointLight.position, "y", -200, 200)
  .name("y轴")
  .onChange((value) => {
    pointLight.position.y = value;
  });
lightFolder
  .add(pointLight.position, "z", -200, 200)
  .name("z轴")
  .onChange((value) => {
    pointLight.position.z = value;
  });
lightFolder
  .addColor(pointLight, "color")
  .name("颜色")
  .onChange((value) => {
    console.log(value);
  });
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
function changeColor() {
  console.log(model);
  const mesh1 = model.scene.getObjectByName("低模铁皮");
  //1. 改变1号楼Mesh材质颜色
  mesh1.material.color.set(0xff0000);
  outlinePass.selectedObjects = [mesh1];
}
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  .canvas-wrap {
  }
  .btns {
    position: absolute;
    top: 0;
    left: 50%;
  }
}
</style>
