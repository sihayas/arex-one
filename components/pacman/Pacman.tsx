import { useState } from "react";

const Pacman = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="pacman-container w-12 h-12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        className="pacman"
        viewBox="0 0 600 300"
      >
        <style jsx>{`
          .pacman-dot {
            fill: white;
          }

          .pacman-open,
          .pacman-mouth-top,
          .pacman-mouth-bottom {
            fill: black;
          }

          .pacman-mouth-top,
          .pacman-mouth-bottom {
            animation-duration: 175ms;
            animation-timing-function: linear;
            animation-direction: alternate;
            animation-iteration-count: infinite;
            transform-origin: calc(300px / 2) 150px;
          }

          .pacman-mouth-top {
            animation-name: rotate-counterclockwise;
          }

          .pacman-mouth-bottom {
            animation-name: rotate-clockwise;
          }

          @keyframes rotate-counterclockwise {
            100% {
              transform: rotate(-30deg);
            }
          }

          @keyframes rotate-clockwise {
            100% {
              transform: rotate(30deg);
            }
          }

          .pacman-dot {
            animation-name: dot-motion;
            animation-duration: 600ms;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          @keyframes dot-motion {
            100% {
              transform: translateX(-100px);
            }
          }
        `}</style>
        <path
          className={`pacman-mouth-bottom ${isActive ? "active" : ""}`}
          d="
          M 150,150
          L 220.4,221.0
          A 100 100 0 0 0 250,150
          Z"
        />
        <path
          className={`pacman-mouth-top ${isActive ? "active" : ""}`}
          d="
          M 150,150 
          L 220.4,79.0
          A 100 100 0 0 1 250,150
          Z"
        />
        <path
          className={`pacman-open ${isActive ? "active" : ""}`}
          d="
          M 150,150
          L 236.6,100
          A 100 100 0 1 0 236.6,200
          Z"
        />
      </svg>
    </div>
  );
};

export default Pacman;
