<template>
  <div class="app">
    <div class="btns"></div>
    <div ref="canvesRef" class="canvas-wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// 高光
const canvesRef = ref(null);
const canvasWidth = window.innerWidth;
const canvasHeight = window.innerHeight;
let model = null;
let currentSelectedModel = null;
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

// 动画渲染循环
function animate() {
  stats.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
// 相机轨道控制器
const cameraControls = new OrbitControls(camera, renderer.domElement);
cameraControls.addEventListener("change", function () {
  // renderer.render(scene, camera); //执行渲染操作
});
cameraControls.target.set(0, 0, 0); // 与相机的lookat保持一致
cameraControls.maxPolarAngle = Math.PI / 2; // 相机不能进入地下

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
      currentSelectedModel = intersects[0].object.clone();
      currentSelectedModel.material = intersects[0].object.material.clone();
      intersects[0].object.material.color.set(0xff0000);
      console.log(currentSelectedModel);
    } else {
      currentSelectedModel = null;
    }
  });
});
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
