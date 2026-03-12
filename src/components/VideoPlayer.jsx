import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null)

    useEffect(() => {
        const v = ref.current
        if (!v) return

        if (isPlaying) {
            v.play().catch(() => { })
        } else {
            v.pause()
            v.currentTime = 0
        }
    }, [isPlaying, src])

    return (
        <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#050510]">
            {/* Video */}
            <video
                ref={ref}
                src={src}
                className={`w-full h-full object-cover transition-all duration-700 ${!isPlaying ? 'opacity-40 blur-[8px] scale-105' : 'opacity-100 blur-0 scale-100'}`}
                playsInline
                muted
                loop
                preload="auto"
            />

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 scanlines opacity-50 pointer-events-none z-10" />

            {/* Center divider line */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-[2px] bg-white/20 pointer-events-none z-10" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-px w-[6px] bg-white/10 blur-sm pointer-events-none z-10" />

            {/* Gradients just for the text badges now, no need for massive UI block spacing */}
            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050510]/90 to-transparent pointer-events-none z-10" />
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050510]/70 to-transparent pointer-events-none z-10" />

            {/* LEFT label */}
            <div className="absolute bottom-6 left-6 px-4 py-2 rounded-xl bg-[#050510]/80 backdrop-blur-xl border border-orange-500/40 z-10 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <span className="text-xs font-black text-orange-400 uppercase tracking-[0.2em]">← Left Side</span>
            </div>

            {/* RIGHT label */}
            <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-[#050510]/80 backdrop-blur-xl border border-blue-500/40 z-10 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <span className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">Right Side →</span>
            </div>

            {/* Live badge */}
            <div className="absolute top-5 left-6 flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#050510]/80 backdrop-blur-xl border border-white/[0.08] z-10 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-red-500 live-dot" />
                <span className="text-[10px] font-black text-gray-200 uppercase tracking-[0.2em]">Live Feed</span>
            </div>

            {/* Spot the AI badge */}
            <div className="absolute top-5 right-6 px-4 py-1.5 rounded-xl bg-[#050510]/80 backdrop-blur-xl border border-white/[0.08] z-10 shadow-xl">
                <span className="text-[10px] font-black text-[#c084fc] uppercase tracking-[0.3em]">Spot the AI</span>
            </div>
        </div>
    )
}
