import type { CSSProperties } from "react";

const BAR_HEIGHTS = [34, 58, 42, 76, 48, 88, 64, 38, 72, 54, 92, 60, 44, 80, 50, 68];

type WaveformProps = {
  active?: boolean;
  compact?: boolean;
  label?: string;
};

export function Waveform({
  active = false,
  compact = false,
  label = "Audio waveform",
}: WaveformProps) {
  return (
    <div
      className={`waveform${active ? " waveform--active" : ""}${compact ? " waveform--compact" : ""}`}
      role="img"
      aria-label={label}
    >
      {BAR_HEIGHTS.map((height, index) => (
        <span
          className="waveform__bar"
          key={`${height}-${index}`}
          style={
            {
              "--bar-height": `${height}%`,
              "--bar-delay": `${index * -70}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
