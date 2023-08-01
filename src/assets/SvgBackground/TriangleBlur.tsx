function TriangleBlur () {
return (
  <svg
  className="z-0 absolute w-screen h-screen stroke-[var(--color-primary-300)]"
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  viewBox="0 0 800 800"
  style={{ pointerEvents: "none" }} // This line is important to make the svg not interact with the mouse
>
  <defs>
    <filter
      id="nnneon-filter"
      x="-100%"
      y="-100%"
      width="400%"
      height="400%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
    
    >
      <feGaussianBlur
        stdDeviation="17 8"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        in="SourceGraphic"
        edgeMode="none"
        result="blur"
      ></feGaussianBlur>
    </filter>
    <filter
      id="nnneon-filter2"
      x="-100%"
      y="-100%"
      width="400%"
      height="400%"
      filterUnits="objectBoundingBox"
      primitiveUnits="userSpaceOnUse"
      color-interpolation-filters="sRGB"
    >
      <feGaussianBlur
        stdDeviation="10 17"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        in="SourceGraphic"
        edgeMode="none"
        result="blur"
      ></feGaussianBlur>
    </filter>
  </defs>
  <g stroke-width="16" stroke="[var(--color-primary-300)]" fill="none">
    <polygon
      points="400,250 250,550 550,550"
      filter="url(#nnneon-filter)"
    ></polygon>
    <polygon
      points="412,250 262,550 562,550"
      filter="url(#nnneon-filter2)"
      opacity="0.25"
    ></polygon>
    <polygon
      points="388,250 238,550 538,550"
      filter="url(#nnneon-filter2)"
      opacity="0.25"
    ></polygon>
    <polygon points="400,250 250,550 550,550"></polygon>
  </g>
</svg>
)
}

export default TriangleBlur;