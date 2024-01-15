import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class DeviceModel {
  constructor(point) {
    this.point = point;
  }
  init() {
    const group = new THREE.Group();
    new GLTFLoader().load(
      "../src/model/exemple_piping/scene.gltf",
      function (gltf) {
        const model = gltf.scene;

        const tex = new THREE.TextureLoader().load(
          "../src/assets/img/设备异常.png"
        );
        const spriteMaterial = new THREE.SpriteMaterial({
          color: 0x00ffff, //设置颜色
          map: tex,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(10, 8, -22);
        sprite.scale.set(4, 4, 1);

        model.scale.set(0.07, 0.07, 0.07);
        const model2 = model.clone();
        model.position.set(6, 0, -10);
        model2.position.set(6, 0, 20);

        group.add(sprite);
        group.add(model);
        group.add(model2);
      },
      undefined,
      function (err) {
        console.log(err);
      }
    );
    return group;
  }
}
