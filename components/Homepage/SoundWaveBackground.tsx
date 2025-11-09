"use client";

/**
 * SoundWaveBackground component creates an animated sound wave spectrum effect
 * Renders vertical bars that animate up and down to simulate an audio equalizer
 */
const SoundWaveBackground = () => {
  // Generate 30 bars for edge-to-edge coverage
  const bars = Array.from({ length: 30 }, (_, i) => {
    // Calculate position-based values (0 = bass/left, 0.5 = mids/center, 1 = highs/right)
    const position = i / 29; // 0 to 1

    // Determine frequency range behavior
    // Bass (0-0.33): Slower, bigger movements, more synchronized
    // Mids (0.33-0.66): Medium speed, medium movements
    // Highs (0.66-1): Faster, smaller movements, more variation

    let frequencyRange = "bass";
    if (position > 0.66) frequencyRange = "highs";
    else if (position > 0.33) frequencyRange = "mids";

    // Bass moves slower and more together
    // Mids have medium variation
    // Highs move faster with more individual variation
    let baseDelay, durationBase, heightMultiplier;

    if (frequencyRange === "bass") {
      baseDelay = 0;
      durationBase = 3.375; // 4.5 * 0.75 = 25% faster
      heightMultiplier = 1.3; // Bass hits harder (taller)
    } else if (frequencyRange === "mids") {
      baseDelay = 0.15; // Closer offset for more synchronization
      durationBase = 2.85; // 3.8 * 0.75 = 25% faster
      heightMultiplier = 1.0; // Medium height
    } else {
      baseDelay = 0.3; // Closer offset for more synchronization
      durationBase = 2.4; // 3.2 * 0.75 = 25% faster
      heightMultiplier = 0.7; // Highs are shorter, more frequent
    }

    // Very small variation within each frequency range for fluid movement
    // Adjacent bars move almost identically
    const localVariation = (i % 10) * 0.01; // Reduced from 0.08 to 0.01
    const animationDelay = `${(baseDelay + localVariation).toFixed(2)}s`;
    const animationDuration = `${(durationBase + Math.sin(i * 0.1) * 0.05).toFixed(2)}s`; // Reduced variation

    // Calculate color based on position in spectrum (gradual transition)
    // From blue on left through purple to pink on right
    const hue = 280 + position * 40; // 280 (blue) to 320 (pink)
    const saturation = 60 + Math.sin(position * Math.PI) * 15; // 45-75%
    const lightness = 50 + Math.sin(position * Math.PI) * 10; // 40-60%

    return {
      id: i,
      animationDelay,
      animationDuration,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      position,
      heightMultiplier,
      frequencyRange,
    };
  });

  return (
    <div
      className="absolute inset-0 flex items-end justify-between gap-[2px] px-0 pb-0 overflow-hidden z-0 opacity-40"
      aria-hidden="true"
    >
      {/* Sound wave bars */}
      {bars.map((bar) => (
        <div
          key={bar.id}
          className={`w-full rounded-t-sm ${
            bar.frequencyRange === "bass"
              ? "animate-spectrum-bass"
              : bar.frequencyRange === "mids"
                ? "animate-spectrum-mids"
                : "animate-spectrum-highs"
          }`}
          style={{
            backgroundColor: bar.color,
            animationDelay: bar.animationDelay,
            animationDuration: bar.animationDuration,
            height: "8%", // Increased from 6% (30% taller)
            opacity: 0.6 + Math.sin(bar.position * Math.PI) * 0.2, // 0.4-0.8
          }}
        />
      ))}
    </div>
  );
};

export default SoundWaveBackground;
