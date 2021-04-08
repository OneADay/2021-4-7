import './index.less';


import BaseRecorder from './recorders/baseRecorder';
import CCaptureRecorder from './recorders/ccaptureRecorder';
import saveThumbnail from './recorders/thumbnailCapture';

import ThreeRenderer from './renderers/threeRenderer';
//import CanvasRenderer from './renderers/canvasRenderer';

interface CanvasElement extends HTMLCanvasElement {               
    captureStream(int): MediaStream;             
}

declare global {
    interface Window { 
        DEBUG: boolean; 
        THUMBNAIL: boolean 
    }
}

const DEBUG: boolean = true;
const THUMBNAIL: boolean = false;
const FORMAT: string = 'gif';

window.DEBUG = DEBUG;
window.THUMBNAIL = THUMBNAIL;

class App {
    canvas: CanvasElement;
    renderer: ThreeRenderer;
    recorder: BaseRecorder;

    animating: boolean = true;

    constructor() {
        this.canvas = <CanvasElement> document.getElementById('canvas');

        this.recorder = new CCaptureRecorder(this.canvas, FORMAT);
        if (this.shouldRecord()) {
            this.recorder.start();
        }

        this.renderer = new ThreeRenderer(
            this.canvas, 
            () => this.handleComplete()
        );

        console.log('DEBUG?', DEBUG);
        console.log('THUMBNAIL?', THUMBNAIL);
        
        this.animation();

        if (THUMBNAIL && !DEBUG) {
            saveThumbnail(this.canvas);
        }
    }

    handleComplete() {
        setTimeout(() => {
            if (this.shouldRecord()) {
                this.recorder.stop();
                this.animating = false;
            }
        }, 100); //delay to capture last frame.
    }

    animation() {
        this.renderer.render();
        if (this.shouldRecord()) {
            this.recorder.update();
        }
        if (this.animating) {
            requestAnimationFrame(() => this.animation());
        }
    }

    shouldRecord() {
        return !DEBUG && !THUMBNAIL;
    }
    
}

new App();