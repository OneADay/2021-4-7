import * as seedrandom from 'seedrandom';
import { BaseRenderer } from './baseRenderer';

const WIDTH: number = 1920 / 2;
const HEIGHT: number = 1080 / 2;


const srandom = seedrandom('b');

export default class CanvasRenderer implements BaseRenderer{

    colors = ['#499aab', '#55dddd', '#cabfea', '#ffbe98', '#2b2f6c'];
    backgroundColor = '#04332d';
    items: any = [];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    maxSize = 10;

    constructor(canvas: HTMLCanvasElement) {
        
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        let size = 1;
        for (let i = 0; i < 100; i++) {
            let color = this.randomColor();
            size = i + this.randomSize();
            this.items.push({size, color});
        }
    }

    render() {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

        for (let i = this.items.length - 1; i > -1; i--) {

            let item = this.items[i];

            this.ctx.save();

            this.ctx.globalAlpha = 0.25;

            this.ctx.translate(WIDTH / 2, HEIGHT / 2);
            this.ctx.scale(item.size, item.size);

            this.ctx.fillStyle = item.color;
            this.ctx.beginPath();
            this.ctx.moveTo(0, -10);
            this.ctx.lineTo(12, 10);
            this.ctx.lineTo(-12, 10);
            this.ctx.closePath();
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    randomColor() {
        return this.colors[Math.floor(srandom() * this.colors.length)];
    }

    randomSize() {
        return srandom() * 10;
    }
}