import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';

interface Marker {
  location: [number, number]; // [latitude, longitude]
  size: number;
}

interface CobeGlobeProps {
  markers?: Marker[];
  className?: string;
  globeSize?: number; // allows overriding default scale
}

export const CobeGlobe: React.FC<CobeGlobeProps> = ({
  className = "",
  markers = [],
  globeSize
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);

  // Simple rotation speed control
  const rotationRef = useRef<number>(0);
  let phi = 0;

  useEffect(() => {
    let width = 0;
    let height = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        height = canvasRef.current.offsetHeight;
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    const devicePixelRatio = window.devicePixelRatio || 1;

    // Increase default scale slightly to make the globe larger
    const scale = globeSize || Math.min(1.2, width / 305);

    const globe = createGlobe(canvasRef.current!, {
      devicePixelRatio,
      width: width * devicePixelRatio,
      height: height * devicePixelRatio,
      scale: scale,
      phi: 0,
      theta: 0.3,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 1,
      baseColor: [1, 1, 1], // White globe
      markerColor: [0, 0, 0], // Black markers
      glowColor: [1.0, 1.0, 1.0],
      markers: markers,
      onRender: (state) => {
        // Update phi based on whether the user is interacting
        if (pointerInteracting.current === null) {
          phi += 0.005; // rotation speed when not interacting
        }
        state.phi = phi + rotationRef.current;
      },
    });

    // Fade in the globe
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = '1';
      }
    }, 100);

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [markers, globeSize]);

  const MAX_DELTA = 300; // Maximum allowed horizontal drag distance in pixels

  const handlePointerDown = (clientX: number) => {
    pointerInteracting.current = clientX - pointerInteractionMovement.current;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerUp = () => {
    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
    // Reset rotation offset after interaction
    pointerInteractionMovement.current = 0;
    rotationRef.current = 0;
  };

  const handleMouseMove = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      let delta = clientX - pointerInteracting.current;
      delta = Math.max(Math.min(delta, MAX_DELTA), -MAX_DELTA);
      pointerInteractionMovement.current = delta;
      rotationRef.current = delta / 200; // Adjust sensitivity as needed
    }
  };

  const handleTouchMove = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      let delta = clientX - pointerInteracting.current;
      delta = Math.max(Math.min(delta, MAX_DELTA), -MAX_DELTA);
      pointerInteractionMovement.current = delta;
      rotationRef.current = delta / 100; // More sensitive for touch
    }
  };

  return (
    <div
      className={`relative w-full h-auto ${className}`}
      style={{ height: '400px', overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          opacity: 0,
          transition: 'opacity 1s ease',
        }}
        onPointerDown={(e) => handlePointerDown(e.clientX)}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerUp}
        onMouseMove={(e) => handleMouseMove(e.clientX)}
        onTouchMove={(e) => e.touches[0] && handleTouchMove(e.touches[0].clientX)}
      />
    </div>
  );
};
