"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MoneyBill {
  id: number;
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  size: number;
  denomination: string;
  color: string;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

interface Coin {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

const DENOMINATIONS = [
  { label: "$100", color: "#2d6a2d", borderColor: "#1a4a1a" },
  { label: "$50", color: "#5a2d8a", borderColor: "#3a1a6a" },
  { label: "$20", color: "#2d4a8a", borderColor: "#1a2a6a" },
  { label: "$1", color: "#2d6a2d", borderColor: "#1a4a1a" },
  { label: "💵", color: "#85bb65", borderColor: "#5a8a40" },
  { label: "💸", color: "#ffd700", borderColor: "#c8a000" },
];

const PARTICLE_COLORS = [
  "#ffd700",
  "#ff69b4",
  "#00ff88",
  "#ff6b35",
  "#7c3aed",
  "#f59e0b",
  "#10b981",
];

function playMoneySound() {
  try {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playNote = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = "sine";
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Cha-ching sound
    playNote(880, now, 0.1);
    playNote(1320, now + 0.05, 0.1);
    playNote(1760, now + 0.1, 0.2);
    playNote(2640, now + 0.15, 0.3);
  } catch {
    // Audio not available
  }
}

export default function MakeItRainClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const billsRef = useRef<MoneyBill[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const [isRaining, setIsRaining] = useState(false);
  const [moneyCount, setMoneyCount] = useState(0);
  const [elonLaunched, setElonLaunched] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);

  const spawnBill = useCallback((canvas: HTMLCanvasElement) => {
    const denom =
      DENOMINATIONS[Math.floor(Math.random() * DENOMINATIONS.length)];
    const bill: MoneyBill = {
      id: nextIdRef.current++,
      x: Math.random() * canvas.width,
      y: -80,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      speedX: (Math.random() - 0.5) * 3,
      speedY: 2 + Math.random() * 4,
      size: 40 + Math.random() * 40,
      denomination: denom.label,
      color: denom.color,
      opacity: 0.85 + Math.random() * 0.15,
      wobble: 0,
      wobbleSpeed: 0.05 + Math.random() * 0.05,
    };
    billsRef.current.push(bill);
  }, []);

  const spawnCoin = useCallback((canvas: HTMLCanvasElement) => {
    const coin: Coin = {
      id: nextIdRef.current++,
      x: Math.random() * canvas.width,
      y: -30,
      speedX: (Math.random() - 0.5) * 4,
      speedY: 3 + Math.random() * 5,
      size: 15 + Math.random() * 20,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 0.9,
    };
    coinsRef.current.push(coin);
  }, []);

  const spawnParticles = useCallback(
    (canvas: HTMLCanvasElement, count: number) => {
      for (let i = 0; i < count; i++) {
        const particle: Particle = {
          id: nextIdRef.current++,
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height * 0.3,
          speedX: (Math.random() - 0.5) * 6,
          speedY: (Math.random() - 0.5) * 6,
          size: 3 + Math.random() * 6,
          color:
            PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          opacity: 1,
          life: 0.02 + Math.random() * 0.02,
        };
        particlesRef.current.push(particle);
      }
    },
    []
  );

  const drawBill = (
    ctx: CanvasRenderingContext2D,
    bill: MoneyBill,
    frame: number
  ) => {
    ctx.save();
    ctx.globalAlpha = bill.opacity;
    const wobbleX = Math.sin(frame * bill.wobbleSpeed + bill.wobble) * 15;
    ctx.translate(bill.x + wobbleX, bill.y);
    ctx.rotate((bill.rotation * Math.PI) / 180);

    const w = bill.size * 1.8;
    const h = bill.size * 0.9;

    // Bill shadow
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Bill body
    const grad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grad.addColorStop(0, bill.color);
    grad.addColorStop(0.5, "#5a9a5a");
    grad.addColorStop(1, bill.color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, 4);
    ctx.fill();

    // Bill border
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner border
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-w / 2 + 4, -h / 2 + 4, w - 8, h - 8);

    // Denomination text
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#ffd700";
    ctx.font = `bold ${bill.size * 0.35}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bill.denomination, 0, 0);

    // Shine effect
    const shine = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    shine.addColorStop(0, "rgba(255,255,255,0.15)");
    shine.addColorStop(0.5, "rgba(255,255,255,0)");
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h / 2, 4);
    ctx.fill();

    ctx.restore();
  };

  const drawCoin = (ctx: CanvasRenderingContext2D, coin: Coin) => {
    ctx.save();
    ctx.globalAlpha = coin.opacity;
    ctx.translate(coin.x, coin.y);
    ctx.rotate((coin.rotation * Math.PI) / 180);

    // Coin glow
    ctx.shadowColor = "#ffd700";
    ctx.shadowBlur = 12;

    // Coin body
    const grad = ctx.createRadialGradient(
      -coin.size * 0.2,
      -coin.size * 0.2,
      0,
      0,
      0,
      coin.size
    );
    grad.addColorStop(0, "#fff5cc");
    grad.addColorStop(0.4, "#ffd700");
    grad.addColorStop(1, "#b8860b");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, coin.size, 0, Math.PI * 2);
    ctx.fill();

    // Coin edge
    ctx.strokeStyle = "#8b6914";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dollar sign
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#8b6914";
    ctx.font = `bold ${coin.size * 0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", 0, 1);

    ctx.restore();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const frame = Date.now() / 50;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw bills
    billsRef.current = billsRef.current.filter((bill) => {
      bill.y += bill.speedY;
      bill.x += bill.speedX;
      bill.rotation += bill.rotationSpeed;
      if (bill.y > canvas.height + 100) return false;
      drawBill(ctx, bill, frame);
      return true;
    });

    // Update and draw coins
    coinsRef.current = coinsRef.current.filter((coin) => {
      coin.y += coin.speedY;
      coin.x += coin.speedX;
      coin.rotation += coin.rotationSpeed;
      coin.speedY += 0.1; // gravity
      if (coin.y > canvas.height + 50) return false;
      drawCoin(ctx, coin);
      return true;
    });

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.opacity -= particle.life;
      if (particle.opacity <= 0) return false;
      drawParticle(ctx, particle);
      return true;
    });

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const startRain = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRaining(true);
    playMoneySound();
    setShowExplosion(true);
    setTimeout(() => setShowExplosion(false), 600);

    // Spawn initial burst
    spawnParticles(canvas, 60);
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        if (canvas) {
          spawnBill(canvas);
          if (Math.random() > 0.5) spawnCoin(canvas);
        }
      }, i * 50);
    }

    setMoneyCount((c) => c + 1);
  }, [spawnBill, spawnCoin, spawnParticles]);

  const stopRain = useCallback(() => {
    setIsRaining(false);
  }, []);

  // Continuous spawning while raining
  useEffect(() => {
    if (!isRaining) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const interval = setInterval(() => {
      spawnBill(canvas);
      if (Math.random() > 0.4) spawnBill(canvas);
      if (Math.random() > 0.6) spawnCoin(canvas);
      if (Math.random() > 0.8) spawnParticles(canvas, 5);
      setMoneyCount((c) => c + 1);
    }, 80);

    return () => clearInterval(interval);
  }, [isRaining, spawnBill, spawnCoin, spawnParticles]);

  // Animation loop
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [animate]);

  // Canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const handleElonLaunch = () => {
    setElonLaunched(true);
    startRain();
    setTimeout(() => setElonLaunched(false), 3000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #0d0d0d 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Arial Black', 'Impact', sans-serif",
      }}
    >
      {/* Animated background stars */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255,215,0,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Canvas for falling money */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Main content */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "2rem",
          gap: "2rem",
        }}
      >
        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(3rem, 10vw, 7rem)",
              fontWeight: 900,
              background:
                "linear-gradient(90deg, #ffd700, #ff8c00, #ffd700, #ffff00, #ffd700)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 3s linear infinite",
              textShadow: "none",
              lineHeight: 1,
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            💰 MAKE IT RAIN! 💰
          </h1>
          <p
            style={{
              color: "#85bb65",
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              marginTop: "0.5rem",
              textShadow: "0 0 20px rgba(133,187,101,0.8)",
              letterSpacing: "4px",
              textTransform: "uppercase",
            }}
          >
            Feel Like a Billionaire 🚀
          </p>
        </div>

        {/* Money counter */}
        <div
          style={{
            background: "rgba(255,215,0,0.1)",
            border: "2px solid rgba(255,215,0,0.3)",
            borderRadius: "12px",
            padding: "0.75rem 2rem",
            color: "#ffd700",
            fontSize: "1.1rem",
            letterSpacing: "2px",
            backdropFilter: "blur(10px)",
            display: moneyCount > 0 ? "block" : "none",
          }}
        >
          💵 ${(moneyCount * 1000000).toLocaleString()} DROPPED
        </div>

        {/* Main button */}
        <button
          onClick={isRaining ? stopRain : startRain}
          style={{
            padding: "1.5rem 4rem",
            fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
            fontWeight: 900,
            background: isRaining
              ? "linear-gradient(135deg, #ff4444, #cc0000)"
              : "linear-gradient(135deg, #ffd700, #ff8c00, #ffc200)",
            border: "none",
            borderRadius: "100px",
            cursor: "pointer",
            color: isRaining ? "#fff" : "#1a1a00",
            boxShadow: isRaining
              ? "0 0 40px rgba(255,68,68,0.8), 0 0 80px rgba(255,68,68,0.4), inset 0 2px 4px rgba(255,255,255,0.3)"
              : "0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,140,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
            transform: showExplosion ? "scale(0.92)" : "scale(1)",
            transition: "all 0.15s ease",
            letterSpacing: "2px",
            textTransform: "uppercase",
            animation: !isRaining
              ? "pulse-btn 2s ease-in-out infinite"
              : "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {isRaining ? "🛑 STOP THE RAIN" : "💸 MAKE IT RAIN!"}
        </button>

        {/* Elon Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            marginTop: "1rem",
          }}
        >
          {/* Elon illustration */}
          <div
            style={{
              position: "relative",
              width: "220px",
              height: "220px",
            }}
          >
            {/* Rocket exhaust */}
            {elonLaunched && (
              <div
                style={{
                  position: "absolute",
                  bottom: "-60px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "3rem",
                  animation: "exhaust 0.1s ease infinite alternate",
                  zIndex: 1,
                }}
              >
                🔥💨
              </div>
            )}

            {/* Elon character */}
            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a2e, #2d2d5e)",
                border: "4px solid #ffd700",
                boxShadow:
                  "0 0 30px rgba(255,215,0,0.5), 0 0 60px rgba(255,215,0,0.2)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem",
                animation: elonLaunched
                  ? "launch 3s ease-out forwards"
                  : "float 4s ease-in-out infinite",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={handleElonLaunch}
              role="button"
              aria-label="Launch Elon"
            >
              {/* Elon emoji face */}
              <div style={{ fontSize: "5rem", lineHeight: 1 }}>🤑</div>
              <div
                style={{
                  fontSize: "0.7rem",
                  color: "#ffd700",
                  letterSpacing: "1px",
                  marginTop: "4px",
                  fontWeight: "bold",
                }}
              >
                ELON MUSK
              </div>
              {/* Space background */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  fontSize: "1rem",
                }}
              >
                🚀
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "15px",
                  fontSize: "0.6rem",
                }}
              >
                ✨
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  right: "18px",
                  fontSize: "0.5rem",
                  color: "#aaa",
                }}
              >
                ★
              </div>
            </div>
          </div>

          <button
            onClick={handleElonLaunch}
            style={{
              padding: "0.75rem 2rem",
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              border: "2px solid #ffd700",
              borderRadius: "50px",
              color: "#ffd700",
              fontSize: "1rem",
              cursor: "pointer",
              fontWeight: "bold",
              letterSpacing: "2px",
              boxShadow: "0 0 20px rgba(255,215,0,0.3)",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 40px rgba(255,215,0,0.6)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, #2a2a4e, #26314e)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 20px rgba(255,215,0,0.3)";
              (e.currentTarget as HTMLButtonElement).style.background =
                "linear-gradient(135deg, #1a1a2e, #16213e)";
            }}
          >
            🚀 LAUNCH ELON INTO MONEY SPACE
          </button>
        </div>

        {/* Fun stats section */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        >
          {[
            { emoji: "💰", label: "Net Worth", value: "$300B+" },
            { emoji: "🚀", label: "Rockets Launched", value: "∞" },
            { emoji: "🌍", label: "Vibes", value: "IMMACULATE" },
            {
              emoji: "💵",
              label: "Money Dropped",
              value:
                moneyCount > 0
                  ? `$${(moneyCount * 1000000).toLocaleString()}`
                  : "$0",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "rgba(255,215,0,0.05)",
                border: "1px solid rgba(255,215,0,0.2)",
                borderRadius: "12px",
                padding: "1rem 1.5rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                minWidth: "130px",
              }}
            >
              <div style={{ fontSize: "2rem" }}>{stat.emoji}</div>
              <div
                style={{
                  color: "#ffd700",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  color: "#888",
                  fontSize: "0.75rem",
                  letterSpacing: "1px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom tagline */}
        <p
          style={{
            color: "rgba(255,215,0,0.4)",
            fontSize: "0.85rem",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          🎰 GrooveRooster Wealth Simulator 2025 🎰
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes launch {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          20% { transform: translateY(-30px) scale(1.1); }
          100% { transform: translateY(-200vh) scale(0.1); opacity: 0; }
        }
        @keyframes exhaust {
          0% { transform: translateX(-50%) scale(1); opacity: 1; }
          100% { transform: translateX(-50%) scale(1.2); opacity: 0.8; }
        }
        @keyframes pulse-btn {
          0%, 100% { 
            box-shadow: 0 0 40px rgba(255,215,0,0.8), 0 0 80px rgba(255,140,0,0.4);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 60px rgba(255,215,0,1), 0 0 120px rgba(255,140,0,0.6);
            transform: scale(1.03);
          }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
