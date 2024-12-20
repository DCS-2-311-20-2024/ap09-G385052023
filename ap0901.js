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
    birdsEye: false,//俯瞰
    axes: true, // 座標軸
  };

  // GUIコントローラの設定
  const gui = new GUI();
  gui.add(param, "birdsEye").name("俯瞰")
  gui.add(param, "axes").name("座標軸");

  // シーン作成
  const scene = new THREE.Scene();

  // 座標軸の設定
  const axes = new THREE.AxesHelper(18);
  scene.add(axes);

  //テクスチャの読み込み
  const textureLoader = new THREE.TextureLoader;
  const suntex = textureLoader.load("sunmap.jpg");
  const mercurytex = textureLoader.load("mercurymap.jpg");
  const venustex = textureLoader.load("venusmap.jpg");
  const earthtex = textureLoader.load("earthmap1k.jpg");
  const moontex = textureLoader.load("moonmap4k.jpg");
  const marstex = textureLoader.load("mars_4k_color.jpg");
  const jupitertex = textureLoader.load("jupitermap.jpg");
  const saturntex = textureLoader.load("saturnmap.jpg");
  const uranustex = textureLoader.load("uranus.jpg");
  const neptunetex = textureLoader.load("neptunemap.jpg");


  //太陽系の作成
  const solarSystem = new THREE.Group;
  //太陽の作成
  const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0x883333 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMaterial.map = suntex;
  solarSystem.add(sun);

  // //水星の作成
  const mercuryGeometry = new THREE.SphereGeometry(0.15, 64, 64);
  const mercuryMaterial = new THREE.MeshLambertMaterial({});
  const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
  mercuryMaterial.map = mercurytex;
  solarSystem.add(mercury);

  //金星の作成
  const venusGeometry = new THREE.SphereGeometry(0.45, 64, 64);
  const venusMaterial = new THREE.MeshLambertMaterial({});
  const venus = new THREE.Mesh(venusGeometry, venusMaterial);
  venusMaterial.map = venustex;
  solarSystem.add(venus);


  //地球の作成
  const earthGeometry = new THREE.SphereGeometry(0.5, 64, 64);
  const earthMaterial = new THREE.MeshLambertMaterial();
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earthMaterial.map = earthtex;
  solarSystem.add(earth);

  //月の作成
  const moonGeometry = new THREE.SphereGeometry(0.15, 64, 64);
  const moonMaterial = new THREE.MeshLambertMaterial();
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moonMaterial.map = moontex;
  solarSystem.add(moon);

  //火星の作成
  const marsGeometry = new THREE.SphereGeometry(0.25, 64, 64);
  const marsMaterial = new THREE.MeshLambertMaterial({});
  const mars = new THREE.Mesh(marsGeometry, marsMaterial);
  marsMaterial.map = marstex;
  solarSystem.add(mars);

  //木星の作成
  const jupiterGeometry = new THREE.SphereGeometry(5, 64, 64);
  const jupiterMaterial = new THREE.MeshLambertMaterial({});
  const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
  jupiterMaterial.map = jupitertex;
  solarSystem.add(jupiter);

  //土星の作成
  const saturnGeometry = new THREE.SphereGeometry(4.5, 64, 64);
  const saturnMaterial = new THREE.MeshLambertMaterial({});
  const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);
  saturnMaterial.map = saturntex;
  solarSystem.add(saturn);

  //天王星の作成
  const uranusGeometry = new THREE.SphereGeometry(2, 64, 64);
  const uranusMaterial = new THREE.MeshLambertMaterial({});
  const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);
  uranusMaterial.map = uranustex;
  solarSystem.add(uranus);

  //海王星の作成
  const neptuneGeometry = new THREE.SphereGeometry(2, 64, 64);
  const neptuneMaterial = new THREE.MeshLambertMaterial({});
  const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
  neptuneMaterial.map = neptunetex;
  solarSystem.add(neptune);

  //太陽系の設定
  solarSystem.children.forEach((child) => {
    child.castShadow = true;
    child.receiveShadow = true;
  });
  scene.add(solarSystem);



  // 光源の設定
  const pointLight = new THREE.PointLight(0xffffff, 1000);
  pointLight.position.set(0, 3, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  const light2 = new THREE.AmbientLight('white', 0);
  scene.add(light2);

  // カメラの作成
  const camera = new THREE.PerspectiveCamera(
    60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(40, 10, 40);
  camera.lookAt(0, 0, 0);

  // レンダラの設定
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, innerHeight);
  renderer.shadowMap.enaled = true;
  renderer.setClearColor(0x222222);
  document.getElementById("output").appendChild(renderer.domElement);

  // カメラ制御
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.listenToKeyEvents(window);
  orbitControls.enableDamping = true;

  // 描画処理
  let earththeta, moontheta, mercurytheta, venustheta, marstheta
    , jupitertheta, saturntheta, uranustheta, neptunetheta;
  earththeta = moontheta = mercurytheta = venustheta = marstheta
    = jupitertheta = saturntheta = uranustheta = neptunetheta = 0;
  const mercuryradius = 11.7;
  const venusradius = 21.6;
  const earthradius = 30;
  const moonradius = 0.5;
  const marsradius = 45.6;
  const jupiterradius = 156;
  const saturnradius = 285;
  const uranusradius = 577;
  const neptuneradius = 900;
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

    //自転
    sun.rotation.y = (sun.rotation.y + 0.09) % (2 * Math.PI);
    mercury.rotation.y = (mercury.rotation.y + 0.031) % (2 * Math.PI);
    venus.rotation.y = (venus.rotation.y + 0.00002) % (2 * Math.PI);
    earth.rotation.y = (earth.rotation.y + 0.05) % (2 * Math.PI);
    moon.rotation.y = (moon.rotation.y + 0.01) % (2 * Math.PI);
    mars.rotation.y = (mars.rotation.y + 0.025) % (2 * Math.PI);
    jupiter.rotation.y = (jupiter.rotation.y + 0.14) % (2 * Math.PI);
    saturn.rotation.y = (saturn.rotation.y + 0.10) % (2 * Math.PI);
    uranus.rotation.y = (uranus.rotation.y + 0.026) % (2 * Math.PI);
    neptune.rotation.y = (neptune.rotation.y + 0.029) % (2 * Math.PI);

    //公転
    mercurytheta = (mercurytheta - 0.0159) % (2 * Math.PI);
    mercury.position.x = mercuryradius * Math.cos(mercurytheta);
    mercury.position.z = mercuryradius * Math.sin(mercurytheta);

    venustheta = (venustheta - 0.0113) % (2 * Math.PI);
    venus.position.x = venusradius * Math.cos(venustheta);
    venus.position.z = venusradius * Math.sin(venustheta);

    earththeta = (earththeta - 0.01) % (2 * Math.PI);
    earth.position.x = earthradius * Math.cos(earththeta);
    earth.position.z = earthradius * Math.sin(earththeta);

    moontheta = (moontheta - 0.13) % (2 * Math.PI);
    moon.position.x = earth.position.x + moonradius * Math.cos(moontheta);
    moon.position.y = 2 * Math.cos(moontheta);
    moon.position.z = earth.position.z + moonradius * Math.sin(moontheta);

    marstheta = (marstheta - 0.0081) % (2 * Math.PI);
    mars.position.x = marsradius * Math.cos(marstheta);
    mars.position.z = marsradius * Math.sin(marstheta);

    jupitertheta = (jupitertheta - 0.004) % (2 * Math.PI);
    jupiter.position.x = jupiterradius * Math.cos(jupitertheta);
    jupiter.position.z = jupiterradius * Math.sin(jupitertheta);

    saturntheta = (saturntheta - 0.0032) % (2 * Math.PI);
    saturn.position.x = saturnradius * Math.cos(saturntheta);
    saturn.position.z = saturnradius * Math.sin(saturntheta);

    uranustheta = (uranustheta - 0.0023) % (2 * Math.PI);
    uranus.position.x = uranusradius * Math.cos(uranustheta);
    uranus.position.z = uranusradius * Math.sin(uranustheta);

    neptunetheta = (neptunetheta - 0.0018) % (2 * Math.PI);
    neptune.position.x = neptuneradius * Math.cos(neptunetheta);
    neptune.position.z = neptuneradius * Math.sin(neptunetheta);


    // 描画
    renderer.render(scene, camera);

    // 次のフレームでの描画要請
    requestAnimationFrame(render);
  }

  // 描画開始
  render();
}

init();
