import * as THREE from 'three';

// Cena
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x22223B); // fundo roxo-escuro

// Câmera 
// PerspectiveCamera(campo de visão, proporção, perto, longe)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5; // Afasta a câmera 5 unidades para a gnt conseguit ver algo

// Renderizador
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Adiciona o <canvas> ao corpo do HTML


// Um objeto 3D: geometria + material = mesh
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // A forma do objeto
const edges = new THREE.EdgesGeometry( geometry ); 
const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0x000000 } ) ); 
scene.add( line );
const material = new THREE.MeshBasicMaterial({ color: 0x9B5DE5 }); // Roxo
const cube = new THREE.Mesh(geometry, material); // Une os dois

// Adiciona o obnjeto a nossa cena
scene.add(cube);




// *********** ANIMACAO ***********

// essa funçao é chamada em loop
function animate() {
    //rotaciona o cubo.
	cube.rotation.x += 0.005;
	cube.rotation.y += 0.005;

    line.rotation.x += 0.005;
    line.rotation.y += 0.005;

	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

animate();