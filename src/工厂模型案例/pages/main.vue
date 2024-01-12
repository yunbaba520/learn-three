<template>
  <div class="app">
    <div class="btns">
      <span class="btn" @click="openFence">{{
        isFence ? "关闭电子围栏" : "开启电子围栏"
      }}</span>
      <span class="btn" @click="flyMain">首页视角</span>
      <span class="btn" @click="inWarehouse">仓库内部</span>
      <span class="btn" @click="seeFire">查看消防设备</span>
    </div>
    <div ref="canvesRef" class="canvas-wrap"></div>
    <ProgressBar v-model="progress"></ProgressBar>
    <InfoBox ref="infoBoxRef" @close="handleClose"></InfoBox>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as THREE from "three";
import TWEEN from "@tweenjs/tween.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 高光
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
// 标签
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
// 组件
import ProgressBar from "../components/progressBar.vue";
import InfoBox from "../components/infoBox.vue";
// class
import Fence from "../three/fence";
import createLabel from "../three/createLabel";
import initFireModel from "../three/addFireModel";

const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let model;
let scene;
let camera;
let renderer;
let stats;
let cameraControls;
// 高光
let composer;
let renderPass;
let outlinePass;
// 标签
let labelRenderer;
// 效果
let fence;
const isFence = ref(false);

const progress = ref(0); // 模型加载进度百分比0-1
const infoBoxRef = ref(null);
let infoBox;
init();
animate();

onMounted(() => {
  canvesRef.value.appendChild(renderer.domElement);
  renderer.domElement.addEventListener("click", clickModel);
  infoBox = new CSS2DObject(infoBoxRef.value.getDom());
});
// 初始化
function init() {
  // 场景
  scene = new THREE.Scene();
  // 模型
  new GLTFLoader().load(
    "../src/model/factory/工厂.glb",
    function (gltf) {
      // console.log("控制台查看加载gltf文件返回的对象结构", gltf);
      model = gltf;
      // console.log('gltf对象场景属性',gltf.scene);
      // 返回的场景对象gltf.scene插入到threejs场景中
      scene.add(gltf.scene);
    },
    function (val) {
      // 加载一部分，就调用函数，可做模型加载进度条
      // console.log("进度", val);
      progress.value = val.loaded / val.total;
    },
    function (err) {
      console.log(err);
    }
  );
  initFireModel(scene);
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
  // 标签
  modelAddTab();

  // 渲染帧率
  stats = new Stats();
  document.body.appendChild(stats.domElement);
  // 渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, //开启优化锯齿
  });
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
  TWEEN.update();

  if (fence) {
    fence.update();
  }

  // renderer.render(scene, camera);
  labelRenderer.render(scene, camera);

  composer.render();

  requestAnimationFrame(animate);
}
// 监听模型点击事件
let selectedCunChu;
function clickModel(event) {
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

  // 找到罐子
  const cunchu = model.scene.getObjectByName("存储罐");
  console.log(cunchu, "cunchu");
  // 可以给待选对象的所有子孙后代Mesh，设置一个祖先属性ancestors,值指向祖先(待选对象)
  for (let i = 0; i < cunchu.children.length; i++) {
    const group = cunchu.children[i];
    //递归遍历chooseObj，并给chooseObj的所有子孙后代设置一个ancestors属性指向自己
    group.traverse(function (obj) {
      if (obj.isMesh) {
        obj.ancestors = group;
      }
    });
  }
  const intersects = raycaster.intersectObjects(cunchu.children);
  console.log("射线器返回的对象", intersects);
  if (intersects.length > 0) {
    // 罐子发光
    selectedCunChu = intersects[0].object.ancestors;
    outlinePass.selectedObjects = [selectedCunChu];
    // infoBox
    infoBoxRef.value.openBox();

    selectedCunChu.add(infoBox);
    // 相机动画
    const pos = new THREE.Vector3();
    selectedCunChu.getWorldPosition(pos);
    const pos2 = pos.clone().addScalar(30);
    console.log(pos);
    cameraFly(pos2, pos);
  } else {
  }
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
// 模型add标签
function modelAddTab() {
  scene.add(createLabel(new THREE.Vector3(10, 13, -10), "仓库"));
  scene.add(createLabel(new THREE.Vector3(0, 13, 38), "设备A"));
  scene.add(createLabel(new THREE.Vector3(18, 13, 38), "设备B"));

  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  //设置.pointerEvents=none，解决HTML元素标签对threejs canvas画布鼠标事件的遮挡
  labelRenderer.domElement.style.pointerEvents = "none";
  document.body.appendChild(labelRenderer.domElement);
}
// 相机飞行动画
function cameraFly(endPos, endTarget) {
  new TWEEN.Tween({
    // 不管相机此刻处于什么状态，直接读取当前的位置和目标观察点
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z,
    tx: cameraControls.target.x,
    ty: cameraControls.target.y,
    tz: cameraControls.target.z,
  })
    .to(
      {
        // 动画结束相机位置坐标
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        // 动画结束相机指向的目标观察点
        tx: endTarget.x,
        ty: endTarget.y,
        tz: endTarget.z,
      },
      2000
    )
    .onUpdate(function (obj) {
      // 动态改变相机位置
      camera.position.set(obj.x, obj.y, obj.z);
      // 动态计算相机视线
      // camera.lookAt(obj.tx, obj.ty, obj.tz);
      cameraControls.target.set(obj.tx, obj.ty, obj.tz);
      cameraControls.update(); //内部会执行.lookAt()
    })
    .start();
}
function flyMain() {
  if (selectedCunChu) {
    selectedCunChu.remove(infoBox);
    outlinePass.selectedObjects = [];
  }
  cameraFly(new THREE.Vector3(-84, 78, 1.3), new THREE.Vector3(0, 0, 0));
}

function handleClose() {
  if (selectedCunChu) {
    selectedCunChu.remove(infoBox);
    outlinePass.selectedObjects = [];
    selectedCunChu = undefined;
    flyMain();
  }
}

function inWarehouse() {
  console.log(model);

  const top = model.scene.getObjectByName("仓库");
  top.traverse(function (obj) {
    if (obj.isMesh) {
      console.log(obj);
      obj.material.transparent = true;
      obj.material.opacity = 0.1;
    }
  });
  // console.log(top);
  // // top.visible = false;
}
function seeFire() {}
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
    z-index: 99;
    .btn {
      color: #fff;
      background-color: #3366ff;
      padding: 5px 20px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
