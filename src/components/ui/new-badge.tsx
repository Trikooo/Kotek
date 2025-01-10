"use client";
import { motion } from "framer-motion";

export default function AnimatedNewBadge() {
  return (
    <motion.div
      className="relative inline-block text-sm"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "inertia", stiffness: 400, damping: 10 }}
    >
      <motion.div
        className="px-2 py-1 font-bold text-white text-md rounded-full overflow-hidden"
        style={{
          background:
            "linear-gradient(-45deg, #00E676, #00BCD4, #2979FF, #651FFF, #00E676)",
          backgroundSize: "600% 600%",
          transition: "box-shadow 0.3s ease-in-out",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
          boxShadow: [
            "0 0 15px rgba(0, 230, 118, 0.4), 0 0 30px rgba(0, 188, 212, 0.3)",
            "0 0 20px rgba(41, 121, 255, 0.5), 0 0 35px rgba(101, 31, 255, 0.4)",
            "0 0 15px rgba(0, 230, 118, 0.4), 0 0 30px rgba(0, 188, 212, 0.3)",
          ],
        }}
        transition={{
          backgroundPosition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "linear",
          },
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        whileHover={{
          boxShadow:
            "0 0 15px rgba(0, 230, 118, 0.7), 0 0 30px rgba(41, 121, 255, 0.5), 0 0 45px rgba(101, 31, 255, 0.3)",
        }}
      >
        NEW!
      </motion.div>
    </motion.div>
  );
}
