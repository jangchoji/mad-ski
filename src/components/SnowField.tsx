const SEED_FLAKES = Array.from({ length: 60 }, (_, i) => {
  const rand = (n: number) => {
    const x = Math.sin(i * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  return {
    left: rand(1) * 100,
    size: 2 + rand(2) * 5,
    duration: 10 + rand(3) * 14,
    delay: rand(4) * -20,
    drift: (rand(5) - 0.5) * 120,
    opacity: 0.4 + rand(6) * 0.6,
  };
});

export function SnowField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SEED_FLAKES.map((f, i) => (
        <span
          key={i}
          className="snow"
          style={{
            left: `${f.left}%`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            opacity: f.opacity,
            ["--size" as string]: `${f.size}px`,
            ["--drift" as string]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
