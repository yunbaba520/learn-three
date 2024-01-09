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
  // 1.创建一个场景
  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    transparent: true, // 开启透视
    opacity: 0.5, // 透明度
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  scene.add(mesh);
  // 添加辅助坐标系(参数是坐标大小)
  const axes = new THREE.AxesHelper(150);
  scene.add(axes);
  // 2.创建相机
  const width = 800;
  const height = 600;
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  // camera.position.set(200, 200, 200);
  // 把相机设置在z轴上
  // camera.position.set(200, 0, 0);
  camera.position.set(-200, 0, 0);

  // camera.lookAt(mesh.position);
  // 相机看向z轴反方向
  camera.lookAt(-1000, 0, 0);

  // 3.创建渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
  wrap.value.appendChild(renderer.domElement);
});
</script>

<style lang="scss" scoped></style>
