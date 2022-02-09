// import './style.css'

import * as THREE from './three.module.js';

let scene, camera, renderer;
let sphere, cloud;
let loader = new THREE.TextureLoader();
let canvas = document.querySelector('canvas.webgl');


let init = () => {

    scene = new THREE.Scene();

    

    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width / height;

    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);  
    
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });

    renderer.setClearColor('black');

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);
    // document.body.appendChild(renderer.domElement);
}

let addSphere = () => {
    let sphereTex = loader.load('./Assets/2k_earth_daymap.jpg');
    let sphereNormal = loader.load('./Assets/2k_earth_normal_map.jpg');
    let sphereSpec = loader.load('./Assets/2k_earth_specular_map.jpg');

    let geometry = new THREE.SphereGeometry( 15, 20, 20 );
    let material = new THREE.MeshPhongMaterial( { map:sphereTex, normalMap: sphereNormal, specularMap: sphereSpec} );

    sphere = new THREE.Mesh( geometry, material );
    geometry.receiveShadow = true;
    scene.add(sphere);
}

let addCloud = () => {
    let sphereTex = loader.load('./Assets/2k_earth_clouds.jpg');

    let geometry = new THREE.SphereGeometry( 15.2, 20, 20 );
    let material = new THREE.MeshStandardMaterial( { alphaMap:sphereTex} );

    cloud = new THREE.Mesh( geometry, material );
    geometry.castShadow = true;
    material.transparent = true;
    scene.add(cloud);
}



let createLight = () => {
    let ambLight = new THREE.AmbientLight('#FFFFFF', 1);
    let spotLight = new THREE.SpotLight('#FFFFFF', 5, 90, Math.PI/ 4);

    spotLight.position.set(40, 20, 20);

    scene.add(spotLight);
    scene.add(ambLight);
}


let onMouseWheel = (event) => {
    if (camera.position.z >= 30 && camera.position.z <= 100) {
        camera.position.z += event.deltaY / 50;
        sphere.material.transparent = true;
        cloud.material.transparent = true;

        sphere.material.opacity -= event.deltaY / 1300;
        cloud.material.opacity -= event.deltaY / 1300;
        
        if(camera.position.z <= 30){
            camera.position.z = 30;
            sphere.material.opacity = 1;
            cloud.material.opacity = 1;
        }
        else if(camera.position.z >= 100){
            camera.position.z = 90;
            sphere.material.opacity = 0;
            cloud.material.opacity = 0;
            // scene.remove(sphere)
        }
    }
    console.log(camera.position.z)
	
}

let addListener = () => {
    document.addEventListener("wheel", onMouseWheel);
}


let animate = () => {
    // sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.002;
    // sphere.rotation.z += 0.01;

    cloud.rotation.y += 0.0025;
}

let render = () => {
    renderer.render(scene, camera);
    animate(); 
    addListener(); 
    requestAnimationFrame(render);

}

window.onload = () => {
    init();
    addSphere();
    addCloud();
    createLight();
    render();
}

window.onresize = () => {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
  
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };



