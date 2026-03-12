import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Countdown({ onDone }) {
    const [n, setN] = useState(3)

    useEffect(() => {
        if (n === 0) { onDone(); return }
        const t = setTimeout(() => setN(c => c - 1), 700)
        return () => clearTimeout(t)
    }, [n, onDone])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-30">

            {/* Semi-transparent dark overlay instead of solid */}
            <div className="absolute inset-0 bg-[#050510]/60 backdrop-blur-md" />

            <div className="relative flex flex-col items-center">
                <motion.div key={n}
                    initial={{ scale: 0.15, opacity: 0, filter: 'blur(12px)' }}
                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                    exit={{ scale: 2.5, opacity: 0, filter: 'blur(12px)' }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                >
                    {n > 0
                        ? <span className="text-[14rem] font-black leading-none select-none drop-shadow-2xl" style={{
                            background: 'linear-gradient(135deg, #c084fc, #22d3ee)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>{n}</span>
                        : <span className="text-[9rem] font-black text-cyan-400 drop-shadow-2xl leading-none select-none">GO!</span>
                    }
                </motion.div>

                {n > 0 && (
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-[11px] font-bold text-gray-300 uppercase tracking-[0.5em] mt-8 bg-black/40 px-6 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
                        Analyze the Footage
                    </motion.span>
                )}
            </div>

            {/* Rings */}
            {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={`r${n}-${i}`}
                    initial={{ scale: 0.2, opacity: 0.8 }}
                    animate={{ scale: 4 + i * 1, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: d }}
                    className={`absolute w-32 h-32 rounded-full border ${i === 0 ? 'border-purple-500/40' : 'border-cyan-500/20'}`}
                />
            ))}
        </motion.div>
    )
}
