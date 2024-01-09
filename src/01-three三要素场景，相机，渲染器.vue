<template>
  <div>
    <div ref="wrap"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as THREE from "three";
const wrap = ref(null);
onMounted(() => {
  // 判断插件是否导入成功
  console.log(THREE.Scene);
  // 1.创建一个场景
  const scene = new THREE.Scene();
  // 创建几何体
  // 形状  参数(x，y，z，剩下的参数是xyz的分段数，默认值1)
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  // 材质
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
  });
  // 网格模型表示物体（形状，材质）组成
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  // 添加模型到场景
  scene.add(mesh);
  // 2.创建相机
  // 设置下画布宽高px
  const width = 800;
  const height = 600;
  // 参数：1：角度大小（眼睛睁开的角度），2：画布的宽高比，3：近椎面距离相机距离，4：远锥面距离相机距离
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // 相机位置，看向的位置
  camera.position.set(200, 200, 200);
  camera.lookAt(mesh.position);
  // 3.创建渲染器
  const renderer = new THREE.WebGLRenderer();
  // canvas大小
  renderer.setSize(width, height);
  // 渲染 render()函数相当于相机按下快门
  renderer.render(scene, camera);
  // 插入元素  把renderer.domElement
  // document.body.appendChild(renderer.domElement);
  wrap.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped></style>
