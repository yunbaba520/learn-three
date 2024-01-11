<template>
  <div class="app">
    <div class="btns">
      <span class="btn" @click="openFence">{{
        isFence ? "关闭电子围栏" : "开启电子围栏"
      }}</span>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
    <ProgressBar v-model="progress"></ProgressBar>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 高光
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";

import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// 组件
import ProgressBar from "../components/progressBar.vue";
// class
import Fence from "../three/fence";
const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let model = null;
let scene;
let camera;
let renderer;
let stats;
let cameraControls;
// 高光
let composer;
let renderPass;
let outlinePass;
// 效果
let fence;
const isFence = ref(false);

const progress = ref(0); // 模型加载进度百分比0-1

init();
animate();

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);

  renderer.domElement.addEventListener("click", (event) => {
    console.log("模型点击", model);
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / canvasWidth) * 2 - 1;
    const y = -(py / canvasHeight) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，用来选中拾取模型对象
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects(model.scene.children);
    console.log("射线器返回的对象", intersects);
    if (intersects.length > 0) {
      // 选中模型的第一个模型，设置为红色
      // intersects[0].object.material.color.set(0xff0000);
      outlinePass.selectedObjects = [intersects[0].object];
    } else {
    }
  });
});
// 初始化
function init() {
  // 场景
  scene = new THREE.Scene();
  // 模型
  new GLTFLoader().load(
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
      console.log("进度", val);
      progress.value = val.loaded / val.total;
    },
    function (err) {
      console.log(err);
    }
  );

  // 相机
  camera = new THREE.PerspectiveCamera(
    75,
    canvasWidth / canvasHeight,
    0.1,
    3000
  );
  camera.position.set(-84, 78, 1.3);
  camera.lookAt(0, 0, 0);
  // 点光源
  const pointLight = new THREE.PointLight(0xffffff, 2.0);
  pointLight.decay = 0.0; //光源光照强度不随距离改变衰减
  pointLight.position.set(-100, 190, 110);
  scene.add(pointLight);
  const ambient = new THREE.AmbientLight(0xffffff, 1.6);
  scene.add(ambient);
  // 坐标辅助对象
  const axesHelper = new THREE.AxesHelper(200);
  scene.add(axesHelper);
  // 渲染帧率
  stats = new Stats();
  document.body.appendChild(stats.domElement);
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, //开启优化锯齿
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(canvasWidth, canvasHeight);
  // 高光
  composer = new EffectComposer(renderer);
  renderPass = new RenderPass(scene, camera);
  outlinePass = new OutlinePass(
    new THREE.Vector2(canvasWidth, canvasHeight),
    scene,
    camera
  );

  const outputPass = new OutputPass();
  composer.addPass(renderPass);
  composer.addPass(outlinePass);
  composer.addPass(outputPass);
  // 相机轨道控制器
  cameraControls = new OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 0, 0);
  cameraControls.maxPolarAngle = Math.PI / 2.1; // 相机不能进入地下
}
// 动画渲染循环
function animate() {
  stats.update();
  if (fence) {
    fence.update();
  }

  // renderer.render(scene, camera);
  composer.render();
  requestAnimationFrame(animate);
}
// 开启电子围栏
function openFence() {
  if (!isFence.value) {
    fence = new Fence(
      [
        [-15, 0, -55],
        [-15, 0, 30],
        [30, 0, 30],
        [30, 0, -55],
        [-15, 0, -55],
      ],
      10,
      "#00ffff"
    );
    fence.draw(scene);
    isFence.value = true;
  } else {
    fence.remove(scene);
    isFence.value = false;
  }
}
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  .btns {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 100px;
    background-color: #3300ff;
    .btn {
      color: #fff;
      background-color: #3366ff;
      padding: 5px 20px;
      cursor: pointer;
    }
  }
}
</style>
