<template>
  <div class="app">
    <div class="btns">
      <button @click="split">{{ isSplit ? "组合" : "分解" }}</button>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

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
let model;
let isSplit = ref(false);
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
  camera.position.set(0, 0, 700);
  camera.lookAt(0, 0, 0);
  // 模型
  addModel();
  // const ambient = new THREE.AmbientLight(0xffffff, 10000);
  // scene.add(ambient);

  const light1 = new THREE.PointLight(0xffffff, 3000000);
  light1.position.set(500, 500, 500);
  scene.add(light1);
  const light2 = new THREE.PointLight(0xffffff, 3000000);
  light2.position.set(-500, -500, -500);
  scene.add(light2);
  // 坐标辅助对象
  // axesHelper = new THREE.AxesHelper(200);
  // scene.add(axesHelper);
  // console.log(scene);
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
  // const geometry = new THREE.BoxGeometry(100, 100, 100);
  // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.set(300, 0, 0);
  // scene.add(cube);
  new GLTFLoader().load(
    "../src/model/bdbs.glb",
    function (gltf) {
      model = gltf.scene.children[0];
      console.log(model);
      scene.add(model);
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
function split() {
  isSplit.value = !isSplit.value;
  if (isSplit.value) {
    // 模型世界中心
    var modelWorldCenter = new THREE.Vector3(0, 0, 0); //.addVectors(box.max,box.min).multiplyScalar(0.5);//模型中心坐标
    // 定义盒子
    var childBox = new THREE.Box3();
    model.traverse(function (child) {
      if (child.isMesh) {
        childBox.setFromObject(child);
        var childCenter = new THREE.Vector3()
          .addVectors(childBox.max, childBox.min)
          .multiplyScalar(0.5);
        if (isNaN(childCenter.x)) return;
        child.childCenter = new THREE.Vector3()
          .subVectors(childCenter, modelWorldCenter)
          .normalize();
        if (!child.isMesh || !child.childCenter) return;
        // 爆炸公式:更改mesh位置
        var p = new THREE.Vector3().copy(child.childCenter).multiplyScalar(100);
        child.oldPosition = child.position.clone();
        child.position.copy(p);
      }
    });
  } else {
    model.traverse(function (child) {
      if (child.isMesh) {
        child.position.copy(child.oldPosition);
      }
    });
  }
}
onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped>
.app {
  position: relative;
  background-color: #00253f;

  .btns {
    position: absolute;
    top: 50px;
    left: 50px;
  }
}
</style>
