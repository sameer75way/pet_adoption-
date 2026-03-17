import { Box, Typography } from "@mui/material";
import PetsRoundedIcon from "@mui/icons-material/PetsRounded";
import { keyframes } from "@mui/system";
import { motion } from "framer-motion";
import { createPortal } from "react-dom";

const spinLayer = keyframes`
  0% { transform: rotateX(64deg) rotateZ(0deg) translateY(0); }
  50% { transform: rotateX(64deg) rotateZ(180deg) translateY(-8px); }
  100% { transform: rotateX(64deg) rotateZ(360deg) translateY(0); }
`;

const pulseGlow = keyframes`
  0% { opacity: 0.35; transform: scale(0.92); }
  50% { opacity: 0.7; transform: scale(1.08); }
  100% { opacity: 0.35; transform: scale(0.92); }
`;

const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(86px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(86px) rotate(-360deg); }
`;

interface SplashLoaderProps {
  isExiting?: boolean;
}

const SplashLoader = ({ isExiting = false }: SplashLoaderProps) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      animate={
        isExiting
          ? {
              opacity: 0,
              scale: 1.035,
              filter: "blur(10px)",
            }
          : {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
            }
      }
      transition={{ duration: isExiting ? 0.65 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    >
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          background:
            "radial-gradient(circle at top, rgba(217,119,6,0.18), transparent 24%), radial-gradient(circle at bottom left, rgba(31,111,120,0.24), transparent 28%), linear-gradient(180deg, #f7f1e8 0%, #efe4d3 100%)",
        }}
      >
        <motion.div initial={{ opacity: 0.85 }} animate={{ opacity: isExiting ? 0 : 1 }} transition={{ duration: 0.45 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
              maskImage: "radial-gradient(circle at center, black 40%, transparent 90%)",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 14 }}
          animate={
            isExiting
              ? { opacity: 0, scale: 0.94, y: -18 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ display: "grid", placeItems: "center", gap: 3 }}>
          <Box sx={{ position: "relative", width: 220, height: 220, display: "grid", placeItems: "center" }}>
            <Box
              sx={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(31,111,120,0.28) 0%, rgba(31,111,120,0.02) 70%)",
                animation: `${pulseGlow} 2.4s ease-in-out infinite`,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                width: 136,
                height: 136,
                transformStyle: "preserve-3d",
                animation: `${spinLayer} 3.2s linear infinite`,
              }}
            >
              {[
                "linear-gradient(135deg, rgba(31,111,120,0.95), rgba(68,153,162,0.72))",
                "linear-gradient(135deg, rgba(217,119,6,0.92), rgba(245,186,106,0.7))",
                "linear-gradient(135deg, rgba(27,43,52,0.85), rgba(27,43,52,0.45))",
              ].map((background, index) => (
                <Box
                  key={background}
                  sx={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.25)",
                    background,
                    transform: `translateZ(${index * 12}px)`,
                    boxShadow: "0 22px 35px rgba(25, 41, 47, 0.14)",
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                animation: `${orbit} 4.2s linear infinite`,
                transformOrigin: "center",
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#fff8ef",
                  boxShadow: "0 14px 24px rgba(25, 41, 47, 0.18)",
                }}
              >
                <PetsRoundedIcon sx={{ color: "secondary.main", fontSize: 20 }} />
              </Box>
            </Box>
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                width: 72,
                height: 72,
                borderRadius: "24px",
                display: "grid",
                placeItems: "center",
                background: "linear-gradient(135deg, #fffaf2 0%, #fff 100%)",
                boxShadow: "0 20px 40px rgba(25, 41, 47, 0.18)",
                border: "1px solid rgba(31,111,120,0.14)",
              }}
            >
              <PetsRoundedIcon sx={{ color: "primary.main", fontSize: 34 }} />
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
              PetAdopt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Warming up shelter workflows
            </Typography>
          </Box>
          </Box>
        </motion.div>
      </Box>
    </motion.div>,
    document.body
  );
};

export default SplashLoader;
