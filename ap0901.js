//
// 応用プログラミング 第9,10回 自由課題 (ap0901.js)
// G385052023 関口柊平
//
"use strict"; // 厳格モード

// ライブラリをモジュールとして読み込む
import * as THREE from "three";
import { OrbitControls } from 'three/addons';
import { GUI } from "ili-gui";

// ３Ｄページ作成関数の定義
function init() {
  // 制御変数の定義
  const param = {
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  //太陽の作成
  const sunGeometry = new THREE.SphereGeometry(3, 16, 16);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: "red" });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  //地球の作成
  const earthGeometry = new THREE.SphereGeometry(1, 16, 16);
  const earthMaterial = new THREE.MeshLambertMaterial({ color: "blue" });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.position.set(20, 0, 20);
  scene.add(earth);

  // 光源の設定
  const spotLight = new THREE.SpotLight(0xffffff, 1000);
  spotLight.position.set(10, 1, 10);
  spotLight.castShadow = true;
  scene.add(spotLight);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(30, 5, 30);
  camera.lookAt(0, 0, 0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.shadowMap.enaled = true;
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラ制御
  const orbitControls
    = new OrbitControls(camera, renderer.domElement);
  orbitControls.listenToKeyEvents(window);
  orbitControls.enableDamping = true;

  // 描画処理

  let theta = 0;
  const radius = 30;
  // 描画関数
  function render() {
    // 座標軸の表示
    axes.visible = param.axes;
    // カメラ位置の制御
    orbitControls.update();

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
