// ParticlesComponent.tsx
import React, { useCallback } from "react";
import type { Container, Engine } from "tsparticles-engine";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { loadPerlinNoisePath } from "tsparticles-path-perlin-noise";

interface ParticlesComponentProps {
  colors: string[][];
}

const ParticlesComponent: React.FC<ParticlesComponentProps> = ({ colors }) => {
  // Default colors
  const defaultColors = [
    "rgb(29, 20, 48)",
    "rgb(104, 195, 239)",
    "rgb(200, 163, 116)",
  ];

  // Prepare the colors
  const preparedColors = colors ? colors.flat() : defaultColors;

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadPerlinNoisePath(engine);
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {},
    [],
  );

  return (
    <div
      style={{
        width: "320px",
        height: "320px",
        position: "absolute",
        zIndex: -1,
        filter: "blur(60px)",
        top: "50%",
        right: "128px",
        transform: "translate(0, -50%)",
      }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          particles: {
            color: {
              value: preparedColors,
            },
            number: {
              value: 9,
              density: {
                enable: false,
                area: 5000,
                factor: 2,
              },
            },
            shape: {
              type: "circle",
            },
            opacity: {
              value: 1,
            },
            size: {
              value: 120,
            },
            move: {
              enable: true,
              direction: "none",
              speed: 6,
              random: true,
              straight: false,
              outModes: {
                default: "out",
              },
              path: {
                generator: "perlin",
                options: {
                  noise: {
                    delay: {
                      random: {
                        enable: true,
                        minimumValue: 0,
                      },
                      value: 50,
                    },
                    enable: true,
                  },
                },
              },
            },
            rotate: {
              value: 0,
              direction: "random",
              animation: {
                enable: true,
                speed: 10,
              },
            },
          },
          detectRetina: true,
          interactivity: {
            detectsOn: "canvas",
            events: {
              onHover: {
                enable: false,
                mode: "none",
              },
              onClick: {
                enable: false,
                mode: "push",
              },
            },
          },
          fullScreen: {
            enable: false,
            zIndex: 0,
          },
        }}
      />
    </div>
  );
};

export default ParticlesComponent;
