"use client";

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulseRange: number;
  pulseOffset: number;
}

interface ConstellationStar {
  x: number;
  y: number;
  r: number;
}

interface GoatConstellation {
  stars: ConstellationStar[];
  connections: number[][];
}

const ConstellationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas to full screen
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStarryBackground();
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Constellation coordinates for goat shapes
    const goatConstellations: GoatConstellation[] = [
      // Main goat in the center-right
      {
        stars: [
          { x: 0.60, y: 0.32, r: 2.8 }, // Head
          { x: 0.65, y: 0.28, r: 3.5 }, // Junction point
          { x: 0.69, y: 0.30, r: 2.8 }, // Neck
          { x: 0.75, y: 0.33, r: 3.2 }, // Body junction
          { x: 0.82, y: 0.35, r: 3.5 }, // Body middle
          { x: 0.88, y: 0.35, r: 3.2 }, // Body end
          { x: 0.91, y: 0.33, r: 2.2 }, // Tail start
          { x: 0.92, y: 0.31, r: 2.5 }, // Tail end
          { x: 0.65, y: 0.23, r: 2.2 }, // Horn base 1
          { x: 0.63, y: 0.19, r: 2.5 }, // Horn mid 1
          { x: 0.60, y: 0.18, r: 2.2 }, // Horn tip 1
          { x: 0.68, y: 0.23, r: 2.2 }, // Horn base 2
          { x: 0.72, y: 0.19, r: 2.5 }, // Horn mid 2
          { x: 0.74, y: 0.17, r: 2.2 }, // Horn tip 2
          { x: 0.65, y: 0.35, r: 2.2 }, // Beard
          { x: 0.63, y: 0.39, r: 2.2 }, // Front leg top
          { x: 0.62, y: 0.44, r: 2.5 }, // Front leg bottom
          { x: 0.71, y: 0.37, r: 2.2 }, // Front leg 2 top
          { x: 0.72, y: 0.43, r: 2.2 }, // Front leg 2 mid
          { x: 0.73, y: 0.48, r: 2.5 }, // Front leg 2 bottom
          { x: 0.83, y: 0.39, r: 2.2 }, // Back leg top
          { x: 0.82, y: 0.45, r: 2.2 }, // Back leg mid
          { x: 0.81, y: 0.50, r: 2.5 }, // Back leg bottom
          { x: 0.88, y: 0.40, r: 2.2 }, // Back leg 2 top
          { x: 0.89, y: 0.45, r: 2.2 }, // Back leg 2 mid
          { x: 0.90, y: 0.50, r: 2.5 }  // Back leg 2 bottom
        ],
        // Connections define which points to connect
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], // Main body
          [5, 6], [6, 7], // Tail
          [1, 8], [8, 9], [9, 10], // Horn 1
          [1, 11], [11, 12], [12, 13], // Horn 2
          [2, 14], // Beard
          [3, 17], [17, 18], [18, 19], // Front leg 2
          [2, 15], [15, 16], // Front leg 1
          [4, 20], [20, 21], [21, 22], // Back leg 1
          [5, 23], [23, 24], [24, 25] // Back leg 2
        ]
      },
      // Smaller goat in the top-left
      {
        stars: [
          { x: 0.25, y: 0.22, r: 2.0 }, // Head
          { x: 0.28, y: 0.20, r: 2.5 }, // Junction point
          { x: 0.31, y: 0.22, r: 2.0 }, // Neck
          { x: 0.34, y: 0.23, r: 2.2 }, // Body junction
          { x: 0.38, y: 0.24, r: 2.5 }, // Body middle
          { x: 0.42, y: 0.24, r: 2.2 }, // Body end
          { x: 0.44, y: 0.23, r: 1.8 }, // Tail start
          { x: 0.45, y: 0.21, r: 2.0 }, // Tail end
          { x: 0.28, y: 0.17, r: 1.8 }, // Horn base 1
          { x: 0.27, y: 0.15, r: 2.0 }, // Horn mid 1
          { x: 0.25, y: 0.14, r: 1.8 }, // Horn tip 1
          { x: 0.30, y: 0.17, r: 1.8 }, // Horn base 2
          { x: 0.32, y: 0.15, r: 2.0 }, // Horn mid 2
          { x: 0.33, y: 0.13, r: 1.8 }, // Horn tip 2
          { x: 0.28, y: 0.24, r: 1.8 }, // Beard
          { x: 0.27, y: 0.26, r: 1.8 }, // Front leg top
          { x: 0.26, y: 0.29, r: 2.0 }, // Front leg bottom
          { x: 0.32, y: 0.25, r: 1.8 }, // Front leg 2 top
          { x: 0.33, y: 0.28, r: 1.8 }, // Front leg 2 mid
          { x: 0.34, y: 0.31, r: 2.0 }, // Front leg 2 bottom
          { x: 0.39, y: 0.26, r: 1.8 }, // Back leg top
          { x: 0.38, y: 0.29, r: 1.8 }, // Back leg mid
          { x: 0.37, y: 0.32, r: 2.0 }, // Back leg bottom
          { x: 0.42, y: 0.26, r: 1.8 }, // Back leg 2 top
          { x: 0.43, y: 0.29, r: 1.8 }, // Back leg 2 mid
          { x: 0.44, y: 0.32, r: 2.0 }  // Back leg 2 bottom
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], // Main body
          [5, 6], [6, 7], // Tail
          [1, 8], [8, 9], [9, 10], // Horn 1
          [1, 11], [11, 12], [12, 13], // Horn 2
          [2, 14], // Beard
          [3, 17], [17, 18], [18, 19], // Front leg 2
          [2, 15], [15, 16], // Front leg 1
          [4, 20], [20, 21], [21, 22], // Back leg 1
          [5, 23], [23, 24], [24, 25] // Back leg 2
        ]
      },
      // Add a third small goat in the bottom part
      {
        stars: [
          { x: 0.20, y: 0.72, r: 2.0 }, // Head
          { x: 0.23, y: 0.70, r: 2.5 }, // Junction point
          { x: 0.26, y: 0.72, r: 2.0 }, // Neck
          { x: 0.29, y: 0.73, r: 2.2 }, // Body junction
          { x: 0.33, y: 0.74, r: 2.5 }, // Body middle
          { x: 0.37, y: 0.74, r: 2.2 }, // Body end
          { x: 0.39, y: 0.73, r: 1.8 }, // Tail start
          { x: 0.40, y: 0.71, r: 2.0 }, // Tail end
          { x: 0.23, y: 0.67, r: 1.8 }, // Horn base 1
          { x: 0.22, y: 0.65, r: 2.0 }, // Horn mid 1
          { x: 0.20, y: 0.64, r: 1.8 }, // Horn tip 1
          { x: 0.25, y: 0.67, r: 1.8 }, // Horn base 2
          { x: 0.27, y: 0.65, r: 2.0 }, // Horn mid 2
          { x: 0.28, y: 0.63, r: 1.8 }, // Horn tip 2
          { x: 0.23, y: 0.74, r: 1.8 }, // Beard
          { x: 0.22, y: 0.76, r: 1.8 }, // Front leg top
          { x: 0.21, y: 0.79, r: 2.0 }, // Front leg bottom
          { x: 0.27, y: 0.75, r: 1.8 }, // Front leg 2 top
          { x: 0.28, y: 0.78, r: 1.8 }, // Front leg 2 mid
          { x: 0.29, y: 0.81, r: 2.0 }, // Front leg 2 bottom
          { x: 0.34, y: 0.76, r: 1.8 }, // Back leg top
          { x: 0.33, y: 0.79, r: 1.8 }, // Back leg mid
          { x: 0.32, y: 0.82, r: 2.0 }, // Back leg bottom
          { x: 0.37, y: 0.76, r: 1.8 }, // Back leg 2 top
          { x: 0.38, y: 0.79, r: 1.8 }, // Back leg 2 mid
          { x: 0.39, y: 0.82, r: 2.0 }  // Back leg 2 bottom
        ],
        connections: [
          [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], // Main body
          [5, 6], [6, 7], // Tail
          [1, 8], [8, 9], [9, 10], // Horn 1
          [1, 11], [11, 12], [12, 13], // Horn 2
          [2, 14], // Beard
          [3, 17], [17, 18], [18, 19], // Front leg 2
          [2, 15], [15, 16], // Front leg 1
          [4, 20], [20, 21], [21, 22], // Back leg 1
          [5, 23], [23, 24], [24, 25] // Back leg 2
        ]
      }
    ];
    
    // Star properties
    let stars: Star[] = [];
    const numStars = 300;
    
    // Animation properties
    let animationFrame: number | null = null;
    const fps = 30;
    const frameInterval = 1000 / fps;
    let then = Date.now();
    
    // Initialize stars
    function createStarryBackground() {
      if (!canvas) return;
      
      stars = [];
      for (let i = 0; i < numStars; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        const opacity = Math.random() * 0.8 + 0.2;
        const pulseSpeed = 0.005 + Math.random() * 0.01;
        const pulseRange = 0.2 + Math.random() * 0.3;
        const pulseOffset = Math.random() * Math.PI * 2;
        
        stars.push({
          x, y, radius, opacity,
          pulseSpeed, pulseRange, pulseOffset
        });
      }
    }
    
    // Animation function
    function animate() {
      if (!canvas || !ctx) return;
      
      const now = Date.now();
      const elapsed = now - then;
      
      if (elapsed > frameInterval) {
        then = now - (elapsed % frameInterval);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw dark background with gradient
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, canvas.width * 0.7
        );
        gradient.addColorStop(0, '#0a1128');
        gradient.addColorStop(1, '#000814');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw twinkling stars
        stars.forEach(star => {
          const time = Date.now() * star.pulseSpeed;
          const pulseFactor = 1 + Math.sin(time + star.pulseOffset) * star.pulseRange;
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * pulseFactor, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * pulseFactor})`;
          ctx.fill();
        });
        
        // Draw goat constellations
        goatConstellations.forEach(goat => {
          // Draw connecting lines
          ctx.strokeStyle = 'rgba(125, 249, 255, 0.4)';
          ctx.lineWidth = 1;
          
          goat.connections.forEach(connection => {
            const [fromIdx, toIdx] = connection;
            const fromStar = goat.stars[fromIdx];
            const toStar = goat.stars[toIdx];
            
            const fromX = fromStar.x * canvas.width;
            const fromY = fromStar.y * canvas.height;
            const toX = toStar.x * canvas.width;
            const toY = toStar.y * canvas.height;
            
            ctx.beginPath();
            ctx.moveTo(fromX, fromY);
            ctx.lineTo(toX, toY);
            ctx.stroke();
          });
          
          // Draw stars
          goat.stars.forEach(star => {
            const time = Date.now() * 0.001;
            const pulseFactor = 1 + Math.sin(time + star.x * 10) * 0.2;
            
            // Draw glow
            const gradient = ctx.createRadialGradient(
              star.x * canvas.width, star.y * canvas.height, 0,
              star.x * canvas.width, star.y * canvas.height, star.r * 4
            );
            gradient.addColorStop(0, 'rgba(125, 249, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(125, 249, 255, 0)');
            
            ctx.beginPath();
            ctx.arc(
              star.x * canvas.width, 
              star.y * canvas.height, 
              star.r * 4, 
              0, 
              Math.PI * 2
            );
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Draw star point
            ctx.beginPath();
            ctx.arc(
              star.x * canvas.width, 
              star.y * canvas.height, 
              star.r * pulseFactor, 
              0, 
              Math.PI * 2
            );
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();
          });
        });
      }
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ background: 'black' }}
    />
  );
};

export default ConstellationCanvas;