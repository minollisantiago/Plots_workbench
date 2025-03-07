

interface Props {
  height: number;
  width: number;
  parentPosition: Record<string, number>;
  zIndex: number;
  gradientLineColor?: string;
  grandientLineWidth?: number;
  gradientLineSpacing?: number;
};

export const CanvasShadow = ({
  height,
  width,
  parentPosition,
  zIndex,
  gradientLineColor = "#f8ac79",
  grandientLineWidth = 0.5,
  gradientLineSpacing = 5,
}: Props) => {

  return (
    <div
      className="absolute border rounded-lg"
      style={{
        height: height,
        width: width,
        transform: `translate(${parentPosition.x - 12}px, ${parentPosition.y + 12}px)`,
        zIndex: zIndex,
        backgroundImage: `repeating-linear-gradient(-45deg,
              transparent,
              ${gradientLineColor} ${grandientLineWidth}px,
              transparent 2px,
              transparent ${gradientLineSpacing}px)`,
        border: `solid 1px ${gradientLineColor}`
      }}
    />
  )
}
