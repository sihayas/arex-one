// import React, { useEffect, useRef } from "react";
// import anime from "animejs";

// const Slider = (props) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const path1Ref = useRef<SVGPathElement | null>(null);
//   const path2Ref = useRef<SVGPathElement | null>(null);
//   const valueRef = useRef<HTMLParagraphElement | null>(null);
//   const starRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     if (
//       !svgRef.current ||
//       !starRef.current ||
//       !path1Ref.current ||
//       !path2Ref.current ||
//       !valueRef.current
//     ) {
//       return;
//     }

//     const svg = svgRef.current;
//     const star = starRef.current;
//     const path1 = path1Ref.current;
//     const path2 = path2Ref.current;
//     const valueText = valueRef.current;

//     const P0 = { x: 10, y: 80 };
//     const P1 = { x: 150, y: 0 };
//     const P2 = { x: 300, y: 80 };

//     star.setAttribute("x", (P0.x - 15).toString());
//     star.setAttribute("y", (P0.y - 15).toString());

//     const svgLeft = svg.getBoundingClientRect().left;
//     const P0_P2_x = P2.x - P0.x;

//     let isDragging = false;
//     let startX = 0;
//     let lastX = 0;

//     star.addEventListener("mousedown", function (event) {
//       event.preventDefault();
//       isDragging = true;
//       startX = event.clientX - svgLeft;
//       lastX = startX;

//       document.addEventListener("mousemove", onMouseMove);
//       document.addEventListener("mouseup", onMouseUp);
//     });

//     function calculateBezier(t, P0, P1, P2) {
//       let u = 1 - t;
//       let tt = t * t;
//       let uu = u * u;
//       let u2 = 2 * u * t;
//       let x = uu * P0.x + u2 * P1.x + tt * P2.x;
//       let y = uu * P0.y + u2 * P1.y + tt * P2.y;

//       return { x: x, y: y };
//     }

//     function lerpColor(a, b, amount) {
//       const ah = parseInt(a.replace(/#/g, ""), 16);
//       const ar = ah >> 16,
//         ag = (ah >> 8) & 0xff,
//         ab = ah & 0xff;
//       const bh = parseInt(b.replace(/#/g, ""), 16);
//       const br = bh >> 16,
//         bg = (bh >> 8) & 0xff,
//         bb = bh & 0xff;
//       const rr = ar + amount * (br - ar);
//       const rg = ag + amount * (bg - ag);
//       const rb = ab + amount * (bb - ab);

//       return (
//         "#" +
//         (((1 << 24) + (rr << 16) + (rg << 8) + rb) | 0).toString(16).slice(1)
//       );
//     }

//     function gradientColor(progress) {
//       const startColor = { r: 128, g: 128, b: 128, a: 0 };
//       const endColor = { r: 0, g: 0, b: 0, a: 1 };
//       const amount = progress;

//       const r = startColor.r + amount * (endColor.r - startColor.r);
//       const g = startColor.g + amount * (endColor.g - startColor.g);
//       const b = startColor.b + amount * (endColor.b - startColor.b);
//       const a = startColor.a + amount * (endColor.a - startColor.a);

//       return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(
//         b
//       )}, ${a.toFixed(2)})`;
//     }

//     function onMouseMove(event) {
//       if (!isDragging) return;

//       let x = event.clientX - svgLeft;
//       lastX = x;

//       if (x < P0.x) x = P0.x;
//       if (x > P2.x) x = P2.x;

//       let t = (x - P0.x) / P0_P2_x;
//       let point = calculateBezier(t, P0, P1, P2);

//       star.setAttribute("x", (point.x - 15).toString());
//       star.setAttribute("y", (point.y - 15).toString());

//       let progress = t;
//       let roundedProgress = Math.round(progress * 20) / 4; // Update this
//       valueText.textContent = roundedProgress.toFixed(1); // Update this
//       if (typeof props.onValueChange === "function") {
//         props.onValueChange(roundedProgress); // Update this
//       }

//       path2.style.strokeWidth = `${1 + progress * 6}`;
//       path2.style.stroke = gradientColor(progress);
//     }

//     function onMouseUp() {
//       isDragging = false;
//       document.removeEventListener("mouseup", onMouseUp);
//       document.removeEventListener("mousemove", onMouseMove);

//       let endX = lastX + (lastX - startX) * 0.2;
//       if (endX < P0.x) endX = P0.x;
//       if (endX > P2.x) endX = P2.x;

//       let t = (endX - P0.x) / P0_P2_x;
//       let point = calculateBezier(t, P0, P1, P2);

//       t = Math.round(t * 10) / 10;
//       point = calculateBezier(t, P0, P1, P2);

//       let animeObj = anime({
//         targets: star,
//         x: Math.round(point.x - 15),
//         y: Math.round(point.y - 15),
//         easing: "easeOutExpo",
//         duration: 500,
//         update: function () {
//           let progress =
//             (parseFloat(star.getAttribute("x") || "0") - P0.x + 15) / P0_P2_x;
//           let roundedProgress = Math.round(progress * 20) / 4;
//           valueText.textContent = roundedProgress.toFixed(1);
//           if (typeof props.onValueChange === "function") {
//             props.onValueChange(roundedProgress);
//           }
//           path2.style.strokeWidth = `${1 + progress * 6}`;
//           path2.style.stroke = gradientColor(progress);
//         },
//       });

//       setTimeout(() => animeObj.pause(), 300);

//       anime({
//         targets: path1,
//         strokeDashoffset: [-10, 0],
//         loop: true,
//         easing: "linear",
//         duration: 500,
//       });
//     }

//     return () => {
//       document.removeEventListener("mousemove", onMouseMove);
//       document.removeEventListener("mouseup", onMouseUp);
//     };
//   }, [props]);

//   return (
//     <div className="flex items-center justify-center">
//       <svg
//         width="320px"
//         height="150px"
//         version="1.1"
//         xmlns="http://www.w3.org/2000/svg"
//         ref={svgRef}
//         className="ml-4"
//       >
//         <path
//           id="path1"
//           d="M10 80 Q 150 0 300 80"
//           stroke="gray"
//           fill="transparent"
//           ref={path1Ref}
//         />
//         <path
//           id="path2"
//           d="M10 80 Q 150 0 300 80"
//           stroke-width="1"
//           stroke="#000"
//           fill="transparent"
//           stroke-linecap="round"
//           ref={path2Ref}
//         />
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           fill="none"
//           viewBox="0 0 24 24"
//           width="30"
//           height="30"
//           x="0"
//           y="0"
//           ref={starRef}
//         >
//           <path
//             fill="#000"
//             d="M12 2.4c-.4 3.6-.5 5.8-1.4 7.3-1.4 1.8-3.8 2-8.2 2.3 4.4.6 6.7.7 8.1 2.3 1 1.5 1.2 3.7 1.5 7.3.6-4.6.7-7 2.7-8.3 1.5-.7 3.7-.9 7-1.3-4.1-.5-6.5-.6-7.9-1.8-1.2-1.4-1.3-3.8-1.8-7.8Z"
//           />
//         </svg>
//       </svg>
//       <p className="text-sm text-grey absolute" ref={valueRef}>
//         0.0
//       </p>
//     </div>
//   );
// };

// export default Slider;
