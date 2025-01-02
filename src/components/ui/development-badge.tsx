"use client";
import { motion } from "framer-motion";

export default function DevelopmentBadge() {
  return (
    <motion.div
      className="text-3xl p-3 z-50 text-center"
      whileHover={{ scale: 1.1}}
      transition={{ type: "inertia", stiffness: 400, damping: 10 }}
    >
      <motion.div
        className="px-4 py-2 font-bold text-white text-md rounded-full overflow-hidden"
        style={{
          background:
            "linear-gradient(-45deg, #ff0000, #ff8080, #cc0000, #ff6666, #ff0000)",
          backgroundSize: "400% 400%",
          transition: "box-shadow 0.2s ease-in-out",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
          boxShadow: [
            "0 0 15px rgba(255, 0, 0, 0.4), 0 0 30px rgba(255, 107, 107, 0.3)",
            "0 0 20px rgba(255, 0, 0, 0.5), 0 0 35px rgba(255, 107, 107, 0.4)",
            "0 0 15px rgba(255, 0, 0, 0.4), 0 0 30px rgba(255, 107, 107, 0.3)",
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
            "0 0 15px rgba(255, 0, 0, 0.7), 0 0 30px rgba(255, 107, 107, 0.5), 0 0 45px rgba(255, 68, 68, 0.3)",
        }}
      >
        Coming Soon...
      </motion.div>
    </motion.div>
  );
}
