// 选择棱锥
import * as THREE from "three";

export default class Pyramid {
  constructor(point, color = 0x00ffff) {
    this.point = point;
    this.color = color;
    this.mesh = null;
    this.num = 0;
    this.init();
  }
  init() {
    const geometry = new THREE.ConeGeometry(4, 14, 4);
    const texture = new THREE.TextureLoader().load(
      "../src/assets/img/渐变色蓝色.png"
    );
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      map: texture,
      transparent: true,
      opacity: 0.6,
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotateX(Math.PI);
    this.mesh.name = "旋转棱锥";
    this.mesh.position.set(this.point.x, this.point.y, this.point.z);
  }
  update() {
    this.mesh.rotateY(0.03);
    this.num += 0.1;
    this.mesh.position.y = 14 + Math.sin(this.num);
  }
}
