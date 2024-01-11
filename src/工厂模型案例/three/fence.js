import * as THREE from "three";

export default class Fence {
  constructor(points, height, color) {
    this.points = points;
    this.height = height;
    this.color = color;
    this.texture = null;
    this.group = new THREE.Group();
  }
  draw(scene) {
    // 围栏距离 累加
    const pointDistance = [];
    // 围栏总长度
    const distance = this.points.reduce((totalDistance, point, index) => {
      let segmentDistance = 0;
      if (index > 0) {
        let lastPoint = new THREE.Vector3(...this.points[index - 1]);
        let currPoint = new THREE.Vector3(...point);
        segmentDistance = lastPoint.distanceTo(currPoint);
      }
      totalDistance += segmentDistance;
      pointDistance.push(totalDistance);
      return totalDistance;
    }, 0);
    // 几何体
    const geometry = new THREE.BufferGeometry(); // 缓冲几何体
    const posArr = [];
    const uvArr = [];
    // 遍历坐标
    // posArr 几何体顶点
    this.points.forEach((point, index) => {
      if (index == 0) return;
      const lastPoint = this.points[index - 1];

      // 三角面1
      posArr.push(...lastPoint);
      uvArr.push(pointDistance[index - 1] / distance, 0);
      posArr.push(...point);
      uvArr.push(pointDistance[index] / distance, 0);
      posArr.push(lastPoint[0], lastPoint[1] + this.height, lastPoint[2]);
      uvArr.push(pointDistance[index - 1] / distance, 1);

      // 三角面2
      posArr.push(...point);
      uvArr.push(pointDistance[index] / distance, 0);
      posArr.push(point[0], point[1] + this.height, point[2]);
      uvArr.push(pointDistance[index] / distance, 1);
      posArr.push(lastPoint[0], lastPoint[1] + this.height, lastPoint[2]);
      uvArr.push(pointDistance[index - 1] / distance, 1);
    });
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(posArr), 3)
    );
    geometry.setAttribute(
      "uv",
      new THREE.BufferAttribute(new Float32Array(uvArr), 2)
    );
    // 纹理
    this.texture = new THREE.TextureLoader().load(
      "../src/assets/img/渐变墙.png"
    );
    this.texture.wrapS = THREE.RepeatWrapping;
    this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(10, 1); // 平铺
    // 材质
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      map: this.texture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    // 创建围栏
    const mesh = new THREE.Mesh(geometry, material);
    const mesh1 = mesh.clone();
    mesh1.material = new THREE.MeshBasicMaterial({
      color: 0x00dfdf,
      transparent: true,
      side: THREE.DoubleSide, //两面可见
      map: new THREE.TextureLoader().load("../src/assets/img/渐变墙-墙体.png"),
    });
    this.group.add(mesh);
    this.group.add(mesh1);
    scene.add(this.group);
  }
  update() {
    if (this.texture) {
      this.texture.offset.y += 0.005;
    }
  }
  remove(scene) {
    scene.remove(this.group);
  }
}
