import * as THREE from 'three';
import { BaseRenderer } from './baseRenderer';
import * as seedrandom from 'seedrandom';
import gsap from 'gsap';
import vertShader from './shaders/vertShader.txt';
import fragShader from './shaders/fragShader.txt';


const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;

const srandom = seedrandom();

let tl;

export default class ThreeRenderer implements BaseRenderer{
    
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    renderer: THREE.Renderer;
    group: THREE.Object3D;
    completeCallback: any;

    constructor(canvas: HTMLCanvasElement, completeCallback: any) {

        this.completeCallback = completeCallback;

        this.camera = new THREE.PerspectiveCamera( 70, WIDTH / HEIGHT, 0.01, 10 );
        this.camera.position.z = 1;
    
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x00c4ff );

        // ADD ITEMS HERE

        let x = -1;
        let y = -.5;
        let z = 0.1;
        let size = .2;

        this.group = new THREE.Object3D();
        
        for (let i = 0; i < 66; i++) {
            let uniforms = {
                r: { value: srandom() }, //0.0 + (i / 66)
                g: { value: 0.5 },
                b: { value: 1.0 },
                delta: {
                    value: 0.5
                }
            };
    
            let geometry = new THREE.BoxGeometry( size, size, size );
            let material = new THREE.ShaderMaterial({
                uniforms,
                vertexShader: vertShader, 
                fragmentShader: fragShader
            });
            let mesh = new THREE.Mesh( geometry, material );
            mesh.position.set(x, y, z);
            this.group.add(mesh);

            x += size;
            if (x > 1) {
                y += size;
                x = -1;
            }
        }

        this.scene.add( this.group );
    
        // END ADD ITEMS

        this.renderer = new THREE.WebGLRenderer( { 
            canvas: canvas, 
            antialias: true
        } );
        this.renderer.setSize( WIDTH, HEIGHT );

        this.createTimeline();
    }

    createTimeline() {

        tl = gsap.timeline({
            delay: 0.1,             // delay to capture first frame
            repeat: window.DEBUG ? -1 : 1, // if debug repeat forever
            repeatDelay: 1,
            yoyo: true, 
            paused: window.THUMBNAIL,
            onComplete: () => this.handleComplete()
        });

        tl.timeScale(3);

        // BUILD TIMELINE HERE

        for (let i = 0; i < this.group.children.length; i++) {
            let item = this.group.children[i];
            let time = i / 10;
            tl.to(item.rotation, {
                x: -Math.PI, 
                duration: 1,
                ease: 'power3.in'
            }, time);
            tl.to(item.position, {
                z: -1, 
                duration: 1,
                ease: 'power3.in'
            }, time);
            tl.to(item.material.uniforms.delta, {
                value: 1, 
                duration: 1,
                ease: 'power3.in'
            }, time);
        }

        // END TIMELINE

        console.log('DURATION:', tl.duration());
    }

    private handleComplete() {
        if (this.completeCallback) {
            this.completeCallback();
        }
    }

    public render() {
        this.renderer.render(this.scene, this.camera);
    }
}