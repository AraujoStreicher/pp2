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
const shaderGrass = new THREE.RawShaderMaterial({
    uniforms: {
        texture: { value: grassTexture }
    },
    
    vertexShader: `
        precision mediump float;
        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `,
    fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform sampler2D texture;

        void main(){
            gl_FragColor = texture2D(texture, vUv);
        }

    `     
});

grassTexture.wrapS = THREE.RepeatWrapping; // Repetir no eixo horizontal
grassTexture.wrapT = THREE.RepeatWrapping; // Repetir no eixo vertical
grassTexture.repeat.set(4, 4);

// Geometria da grama
const grassGeometry = new THREE.CylinderGeometry(5, 5, 1, 32);
const grassMaterial = new THREE.MeshStandardMaterial({ map: grassTexture, color: 0x7ac459}); // verde
const grass = new THREE.Mesh(grassGeometry, shaderGrass);
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
const mountain1Geometry = new THREE.SphereGeometry(1.4, 32, 32);
const mountain1 = new THREE.Mesh(mountain1Geometry, rockMaterial);
mountain1.scale.set(1, 0.6, 1); 
mountain1.position.set(1.8, 0.8, 0);

islandGroup.add(mountain1);

const mountain2Geometry = new THREE.SphereGeometry(1.6, 32, 32);
const mountain2 = new THREE.Mesh(mountain2Geometry, rockMaterial);
mountain2.scale.set(1, 0.6, 1); 
mountain2.position.set(-1.8, 0.8, 0);

islandGroup.add(mountain2);

const mountain3Geometry = new THREE.CapsuleGeometry(2, 0.5, 5, 8, 6);
const mountain3 = new THREE.Mesh(mountain3Geometry, rockMaterial);
mountain3.scale.set(1, 0.8, 1); 
mountain3.position.set(0, 1, -2); 

islandGroup.add(mountain3)

const waterfallTexture = textureLoader.load('textures/waterfall.jpg');
//queda d'água
const shaderWaterfall = new THREE.RawShaderMaterial({
    uniforms: {
        texture: { value: waterfallTexture },
        offset: { value: new THREE.Vector2(0,0) }
    },
    transparent: true,
    opacity: 0.7,
    
    vertexShader: `
        precision mediump float;
        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `,
    fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform sampler2D texture;
        uniform vec2 offset;

        void main(){
            vec2 uv = vUv + offset;
            gl_FragColor = texture2D(texture, uv);
        }

    `     
});

const shaderLake = new THREE.RawShaderMaterial({
    uniforms: {
        texture: { value: waterfallTexture }
    },
    transparent: true,
    opacity: 0.7,
    
    vertexShader: `
        precision mediump float;
        attribute vec3 position;
        attribute vec2 uv;

        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;

        varying vec2 vUv;

        void main(){
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `,
    fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform sampler2D texture;

        void main(){
            gl_FragColor = texture2D(texture, vUv);
        }

    `     
});

waterfallTexture.wrapS = THREE.RepeatWrapping;
waterfallTexture.wrapT = THREE.RepeatWrapping;
waterfallTexture.repeat.set(1, 4); 

const waterfallGeometry = new THREE.CapsuleGeometry(0.9, 1.5);
const waterfallMaterial = new THREE.MeshStandardMaterial({ map: waterfallTexture, color: 0x3CAEA3, transparent: true, opacity: 0.7 }); 
const waterfall = new THREE.Mesh(waterfallGeometry, shaderWaterfall);

waterfall.position.set(0, 1, -0.5);

islandGroup.add(waterfall);

//lago
const lakeGeometry = new THREE.CircleGeometry(2.5, 32);
const lakeMaterial = new THREE.MeshStandardMaterial({ map: waterTexture, color: 0x3CAEA3, transparent: true, opacity: 0.7 })
const lake = new THREE.Mesh(lakeGeometry, shaderLake);
lake.rotation.x = -Math.PI/2;
lake.position.set(0, 0.55, 0);

islandGroup.add(lake);

// ====== ÁRVORES =======

// Tronco
const trunkGeometry = new THREE.CylinderGeometry(0.2, 0, 4, 8);
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B5A2B }); 
const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);

// Folhas
const leavesGeometry = new THREE.SphereGeometry(1, 16, 16);
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x32CD32 }); 
const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
leaves.position.y = 2.9; //precisa ficar em cima do tronco

const tree1 = new THREE.Group();
tree1.add(trunk);
tree1.add(leaves);

tree1.position.set(2, 0, -1.5); 
islandGroup.add(tree1);


// ====== BARQUINHO =======

const boat = new THREE.Group();

// Casco do barco
const hullGeometry = new THREE.SphereGeometry(0.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2);
const hullMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513, side: THREE.DoubleSide }); // colore os dois lados da face
const hull = new THREE.Mesh(hullGeometry, hullMaterial);
hull.scale.set(1.5, 0.7, 0.7); // esticar e achatar
hull.position.y = 0.95;
hull.rotation.x = Math.PI ;
boat.add(hull);

// Mastro
const mastGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.3);
const mastMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const mast = new THREE.Mesh(mastGeometry, mastMaterial);
mast.position.y = 1.3;
boat.add(mast);

// Vela
const sailGeometry = new THREE.PlaneGeometry(0.7, 0.7);
const sailMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide });
const sail = new THREE.Mesh(sailGeometry, sailMaterial);
sail.position.y = 1.5;
sail.position.x = 0.4;
boat.add(sail);

boat.position.set(-3, 0, 3.5); 
islandGroup.add(boat);

scene.add(islandGroup); 

// *********** ANIMACAO ***********

// essa funçao é chamada em loop
function animate() {
    //islandGroup.rotation.y += 0.002; // Rotaciona a ilha lentamente

    waterTexture.offset.x += 0.001; // move a textura da água
    waterTexture.offset.y += 0.001;

    shaderWaterfall.uniforms.offset.value.y += 0.001; // descida na cachoeira

	renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );

animate();