export const BlurDiv = ({
  blurValue,
  gradientStops,
  zIndex,
  className,
}: {
  blurValue: number;
  gradientStops: string;
  zIndex: number;
  className?: string;
}) => (
  <div
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    style={{
      zIndex,
      backdropFilter: `blur(${blurValue}px)`,
      WebkitBackdropFilter: `blur(${blurValue}px)`,
      maskImage: `linear-gradient(to bottom, ${gradientStops})`,
      WebkitMaskImage: `linear-gradient(to bottom, ${gradientStops})`,
    }}
  />
);
