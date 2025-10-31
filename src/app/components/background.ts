import { Component, OnDestroy, ElementRef, viewChild, effect, computed } from '@angular/core';

const PARTICLE_COUNT = 200

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface CanvasInfo {
  canvas: HTMLCanvasElement
  context: CanvasRenderingContext2D
}

@Component({
  selector: 'app-background',
  standalone: true,
  template: `<canvas #particleCanvas></canvas>`,
  styles: [`
    canvas {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  `]
})
export class Background implements OnDestroy {
  private canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('particleCanvas')
  
  private info = computed<CanvasInfo | undefined>((canvasRef = this.canvasRef()) => {
    if (!canvasRef) {
      return undefined
    }
    const canvas = canvasRef.nativeElement
    const context = canvas.getContext('2d')
    if (!canvas || !context) {
      return undefined
    }
    return { canvas, context }
  });

  private particles: Particle[] = [];
  private animationId?: number;
  private resizeObserver?: ResizeObserver;

  constructor() {
    effect(() => {
      const canvas = this.canvasRef()?.nativeElement
      if (!canvas) {
        return
      }
    
      this.resizeCanvas();
      this.initParticles();
      this.animate();

      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas())
      this.resizeObserver.observe(document.body)
    })
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.resizeObserver?.disconnect()
  }

  private resizeCanvas(): void {
    this.useCanvas(({ canvas }) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    })
  }

  private initParticles(): void {
    this.useCanvas(({ canvas }) => {
      this.particles = [];
      
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        this.particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2
        });
      }
    })
  }

  private updateParticle(particle: Particle): void {
    this.useCanvas(({ canvas }) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    })
  }

  private drawParticle(particle: Particle): void {
    this.useCanvas(({ context }) => {
      context.fillStyle = 'rgba(0, 255, 255, 0.5)';
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    })
  }

  private drawConnections(): void {
    this.useCanvas(({ context }) => {
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const dx = this.particles[i].x - this.particles[j].x;
          const dy = this.particles[i].y - this.particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            context.strokeStyle = `rgba(0, 255, 255, ${0.2 * (1 - distance / 150)})`;
            context.lineWidth = 0.5;
            context.beginPath();
            context.moveTo(this.particles[i].x, this.particles[i].y);
            context.lineTo(this.particles[j].x, this.particles[j].y);
            context.stroke();
          }
        }
      }
    })
  }

  private animate(): void {
    this.useCanvas(({ canvas, context }) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      this.particles.forEach(particle => {
        this.updateParticle(particle);
        this.drawParticle(particle);
      });
  
      this.drawConnections();
      this.animationId = requestAnimationFrame(() => this.animate());
    })
  }

  private useCanvas(cb: (info: CanvasInfo) => void): void {
    const info = this.info()
    if (info) {
      cb(info)
    }
  }
}