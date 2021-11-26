// set and cache variables

var w, container, carousel, item, radius, itemLength, rY, ticker, fps;
var mouseX = 0;
var mouseY = 0;
var mouseZ = 0;
var addX = 0;



// fps counter created by: https://gist.github.com/sharkbrainguy/1156092,
// no need to create my own :)
var fps_counter = {

    tick: function() {
        // this has to clone the array every tick so that
        // separate instances won't share state 
        this.times = this.times.concat(+new Date());
        var seconds, times = this.times;

        if (times.length > this.span + 1) {
            times.shift(); // ditch the oldest time
            seconds = (times[times.length - 1] - times[0]) / 1000;
            return Math.round(this.span / seconds);
        } else return null;
    },

    times: [],
    span: 20
};
var counter = Object.create(fps_counter);



$(document).ready(init)

function init() {



    w = $(window);
    container = $('#contentContainer');
    carousel = $('#carouselContainer');
    item = $('.carouselItem');
    itemLength = $('.carouselItem').length;
    fps = $('#fps');
    rY = 360 / itemLength;
    radius = Math.round((250) / Math.tan(Math.PI / itemLength));


    // set container 3d props
    TweenMax.set(container, { perspective: 600 })
    TweenMax.set(carousel, { z: -(radius) })

    // create carousel item props

    for (var i = 0; i < itemLength; i++) {
        var $item = item.eq(i);
        var $block = $item.find('.carouselItemInner');

        //thanks @chrisgannon!        
        TweenMax.set($item, { rotationY: rY * i, z: radius, transformOrigin: "50% 50% " + -radius + "px" });

        animateIn($item, $block)
    }

    // set mouse x and y props and looper ticker
    window.addEventListener("mousemove", onMouseMove, false);
    ticker = setInterval(looper, 1000 / 60);
}

function animateIn($item, $block) {
    var $nrX = 360 * getRandomInt(2);
    var $nrY = 360 * getRandomInt(2);

    var $nx = -(2000) + getRandomInt(4000)
    var $ny = -(2000) + getRandomInt(4000)
    var $nz = -4000 + getRandomInt(4000)

    var $s = 1.5 + (getRandomInt(10) * .1)
    var $d = 1 - (getRandomInt(8) * .1)

    TweenMax.set($item, { autoAlpha: 1, delay: $d })
    TweenMax.set($block, { z: $nz, rotationY: $nrY, rotationX: $nrX, x: $nx, y: $ny, autoAlpha: 0 })
    TweenMax.to($block, $s, { delay: $d, rotationY: 0, rotationX: 0, z: 0, ease: Expo.easeInOut })
    TweenMax.to($block, $s - .5, { delay: $d, x: 0, y: 0, autoAlpha: 1, ease: Expo.easeInOut })
}

function onMouseMove(event) {
    mouseX = -(-(window.innerWidth * .5) + event.pageX) * .0025;
    mouseY = -(-(window.innerHeight * .5) + event.pageY) * .01;
    mouseZ = -(radius) - (Math.abs(-(window.innerHeight * .5) + event.pageY) - 200);
}

// loops and sets the carousel 3d properties
function looper() {
    addX += mouseX
    TweenMax.to(carousel, 1, { rotationY: addX, rotationX: mouseY, ease: Quint.easeOut })
    TweenMax.set(carousel, { z: mouseZ })
    fps.text('Framerate: ' + counter.tick() + '/60 FPS')
}

function getRandomInt($n) {
    return Math.floor((Math.random() * $n) + 1);

}

//3D code starts-------------------------------------------------------------
//Set Global Variables
var specs;
var width, height, length, bwidth, bheight, blength, groundy;
bwidth = 20 * 20;
bheight = 10 * 20, blength = 40 * 20;
groundy = bheight / 2

// Set Scene Camera and Renderer

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcce0ff);
scene.fog = new THREE.Fog(0xcce0ff, 1500, 2000);

var controls = new THREE.OrbitControls(camera);

var renderer = new THREE.WebGLRenderer({ antialias: true });
var container = document.getElementById('canvas');
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(container.innerWidth, container.innerHeight);
container.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, container.innerWidth / container.innerHeight, 0.1, 2000);
camera.position.set(bwidth * -1.25, bheight + 0, blength * 1.25);

// change aspect and view port size on widow resize

//window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    camera.aspect = container.innerWidth / container.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);

}

// Loader
var loader = new THREE.TextureLoader();

// lights
var light, materials;
scene.add(new THREE.AmbientLight(0x666666));
light = new THREE.DirectionalLight(0xdfebff, 1);
light.position.set(50, 200, 100);
light.position.multiplyScalar(1.3);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
var d = 300;
light.shadow.camera.left = -d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = -d;
light.shadow.camera.far = 1000;
scene.add(light);

// ground
var groundTexture = loader.load('assets/Grass_Texture.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(50, 50);
groundTexture.anisotropy = 16;
var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), groundMaterial);
mesh.position.y = -groundy;
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);


//add geometry

var geometry = new THREE.BoxGeometry(bwidth, bheight, blength);
var material = new THREE.MeshLambertMaterial({ color: 0xdddddd });
/*var wallMaterial =
[
     new MeshLambertMaterial ({ map: new THREE.TextureLoader( 'file.png' ) load(), side: THREE.Doubleside } )


] */
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);



//render scene in animate loop

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();