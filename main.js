import * as THREE from 'three';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9FC5E8); // fundo azul clarinho

// Câmera 
// PerspectiveCamera(campo de visão, proporção, perto, longe)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10; // Afasta a câmera 5 unidades para a gnt conseguit ver algo
camera.position.y = 5; // Eleva a câmera para ver a ilha de cima
camera.lookAt(0, 0, 0); // Centraliza

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Adiciona o <canvas> ao corpo do HTML
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//Lightning
//Luz ambiente que ilumina a cena de forma uniforme, nao serve para criar sombras
const light = new THREE.AmbientLight( 0xffffff, 0.5 ); 
scene.add( light );
// Luz direcional que simula a luz do sol, cria sombras
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Texture
const textureLoader = new THREE.TextureLoader();

// ======= ÁGUA =======
// Textura 
const waterTexture = textureLoader.load('textures/water.jpg');
waterTexture.wrapS = THREE.RepeatWrapping;
waterTexture.wrapT = THREE.RepeatWrapping;
waterTexture.repeat.set(4, 4); 

const waterGeometry = new THREE.PlaneGeometry(90, 30, 1, 1);
const waterMaterial = new THREE.MeshStandardMaterial({ map: waterTexture, transparent: true, opacity: 0.7 });
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.position.y = -1;
water.rotation.x = -Math.PI/2;

scene.add(water);

// ======= ILHA =======
// Criando grupo da ilha
const islandGroup = new THREE.Group();

// 1º objeto: a base da ilha -- grama e rocha
// Textura da grama
const grassTexture = textureLoader.load('textures/grass.jpg'); 
grassTexture.wrapS = THREE.RepeatWrapping; // Repetir no eixo horizontal
grassTexture.wrapT = THREE.RepeatWrapping; // Repetir no eixo vertical
grassTexture.repeat.set(4, 4);

// Geometria da grama
const grassGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: 0x7ac459}); // verde
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.position.y = 0;
grass.receiveShadow = true; 
islandGroup.add(grass); 

// Textura da rocha
const rockTexture = textureLoader.load('textures/rock.jpg');
rockTexture.wrapS = THREE.RepeatWrapping;
rockTexture.wrapT = THREE.RepeatWrapping;
rockTexture.repeat.set(4, 4); 

// Geometria da rocha
const rockGeometry = new THREE.CylinderGeometry(4.5, 3.5, 4, 32);
const rockMaterial = new THREE.MeshStandardMaterial({ map: rockTexture}); // marrom 
const rock = new THREE.Mesh(rockGeometry, rockMaterial);
rock.position.y = -2.5;
rock.receiveShadow = true;
islandGroup.add(rock);

// ====== CACHOEIRA =======
//Montanhas
const mountain1Geometry = new THREE.CapsuleGeometry(1.5, 2, 5, 8, 6);
const mountain1 = new THREE.Mesh(mountain1Geometry, grassMaterial);
mountain1.position.x = 2;
mountain1.position.y = 2;

islandGroup.add(mountain1);

const mountain2 = new THREE.Mesh(mountain1Geometry, grassMaterial);
mountain2.position.x = -1.8;
mountain2.position.y = 2;

islandGroup.add(mountain2);

const mountain3Geometry = new THREE.CapsuleGeometry(2, 3, 5, 8, 6);
const mountain3 = new THREE.Mesh(mountain3Geometry, grassMaterial);
mountain3.position.set(0, 2, -1.9);

islandGroup.add(mountain3)

//queda d'água
const waterfallTexture = textureLoader.load('textures/waterfall.jpg');
waterfallTexture.wrapS = THREE.RepeatWrapping;
waterfallTexture.wrapT = THREE.RepeatWrapping;
waterfallTexture.repeat.set(1, 4); 

const waterfallGeometry = new THREE.CapsuleGeometry(1.2, 4.5);
const waterfallMaterial = new THREE.MeshStandardMaterial({ map: waterfallTexture, color: 0x3CAEA3, transparent: true, opacity: 0.7 }); 
const waterfall = new THREE.Mesh(waterfallGeometry, waterfallMaterial);

waterfall.position.set(0, 0.8, -0.5);

islandGroup.add(waterfall);

//lago
const lakeGeometry = new THREE.CircleGeometry(3.5, 32);
const lakeMaterial = new THREE.MeshStandardMaterial({ map: waterTexture, color: 0x3CAEA3, transparent: true, opacity: 0.7 })
const lake = new THREE.Mesh(lakeGeometry, lakeMaterial);
lake.rotation.x = -Math.PI/2;
lake.position.set(0, 0.55, 0);

islandGroup.add(lake);

scene.add(islandGroup); 

// *********** ANIMACAO ***********

// essa funçao é chamada em loop
function animate() {
    //islandGroup.rotation.y += 0.002; // Rotaciona a ilha lentamente

    waterTexture.offset.x += 0.001; // move a textura da água
    waterTexture.offset.y += 0.001;

    waterfallTexture.offset.y += 0.005; // descida na cachoeira

	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

animate();