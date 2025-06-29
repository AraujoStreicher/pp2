import * as THREE from 'three';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9FC5E8); // fundo azul clarinho

// Câmera 
// PerspectiveCamera(campo de visão, proporção, perto, longe)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10; // Afasta a câmera 5 unidades para a gnt conseguit ver algo
camera.position.y = 5; // Eleva a câmera para ver a ilha de cima
camera.lookAt(0, 0, 0); 

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Adiciona o <canvas> ao corpo do HTML

//Lightning
//Luz ambiente que ilumina a cena de forma uniforme, nao serve para criar sombras
const light = new THREE.AmbientLight( 0xffffff, 0.5 ); 
scene.add( light );
// Luz direcional que simula a luz do sol, cria sombras
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Texture
const textureLoader = new THREE.TextureLoader();

// ======= ILHA =======
// Criando grupo da ilha
const islandGroup = new THREE.Group();

// 1º objeto: a base da ilha -- grama e rocha
const grassTexture = textureLoader.load('textures/grass.jpg'); 
grassTexture.wrapS = THREE.RepeatWrapping; // Repetir no eixo horizontal
grassTexture.wrapT = THREE.RepeatWrapping; // Repetir no eixo vertical
grassTexture.repeat.set(4, 4);

const grassGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
const grassMaterial = new THREE.MeshBasicMaterial({ map: grassTexture, color: 0xdddddd }); // verde
const grass = new THREE.Mesh(grassGeometry, grassMaterial);
grass.position.y = 0;
islandGroup.add(grass); 

const rockTexture = textureLoader.load('textures/rock.jpg');
rockTexture.wrapS = THREE.RepeatWrapping;
rockTexture.wrapT = THREE.RepeatWrapping;
rockTexture.repeat.set(4, 4); 

const rockGeometry = new THREE.CylinderGeometry(4.5, 3.5, 4, 32);
const rockMaterial = new THREE.MeshBasicMaterial({ map: rockTexture }); // marrom 
const rock = new THREE.Mesh(rockGeometry, rockMaterial);
rock.position.y = -2.5;
islandGroup.add(rock);


scene.add(islandGroup); 

// *********** ANIMACAO ***********

// essa funçao é chamada em loop
function animate() {
    islandGroup.rotation.y += 0.002; // Rotaciona a ilha lentamente

	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

animate();