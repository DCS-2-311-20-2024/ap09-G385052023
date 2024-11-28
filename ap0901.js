//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G385052023 関口柊平
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { GLTFLoader } from "three/addons";
import { OrbitControls } from 'three/addons';
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    background: true,
    birdsEye: false,
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "background").name("背景");
  gui.add(param, "birdsEye").name("俯瞰")
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  //太陽の作成
  const sunGeometry = new THREE.SphereGeometry(3, 16, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xe60033 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  //地球の作成
  const earthGeometry = new THREE.SphereGeometry(1, 16, 16);
  const earthMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.set(20, 0, 20);
  earth.receiveShadow = true;
  scene.add(earth);

  // 光源の設定
  const spotLight = new THREE.SpotLight(0xffffff, 1000);
  spotLight.position.set(15, 15, 15);
  spotLight.castShadow = true;
  scene.add(spotLight);

  const light2 = new THREE.AmbientLight('white', 0.2);
  scene.add(light2);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(40, 5, 40);
  camera.lookAt(0, 0, 0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.shadowMap.enaled = true;
  renderer.setClearColor(0x000030);
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラ制御
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.listenToKeyEvents(window);
  orbitControls.enableDamping = true;

  // 背景の設定
  let renderTarget;
  function setBackground() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      "space.png",
      () => {
        renderTarget
          = new THREE.WebGLCubeRenderTarget(texture.image.height);
        renderTarget.fromEquirectangularTexture(renderer, texture);
        scene.background = renderTarget.texture;
        render();
      }
    )
  }
  setBackground();

  // 描画処理

  let theta = 0;
  const radius = 30;
  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // カメラ位置の制御
    orbitControls.update();

    //カメラ位置の切り替え
    if (param.birdsEye) {
      camera.position.set(0, 100, 0);
      camera.up.set(0, 1, 0);
    }

    // 背景の切り替え
    if (param.background) {
      scene.background = renderTarget.texture;
      //plane.visible = false;
    } else {
      scene.background = null;
      //plane.visible = true;
    }

    //自転
    sun.rotation.y = (sun.rotation.y + 0.01) % (2 * Math.PI);
    earth.rotation.y = (earth.rotation.y + 0.01) % (2 * Math.PI);

    //公転
    theta = (theta - 0.01) % (2 * Math.PI);
    earth.position.x = radius * Math.cos(theta);
    earth.position.z = radius * Math.sin(theta);

    // 描画
    renderer.render(scene, camera);

    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();

//画像
