import { motion } from 'framer-motion'

export default function ScorePopup({ score, correct }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">

            {/* Dimmed backdrop so video is visible but dark */}
            <div className="absolute inset-0 bg-[#050510]/70 backdrop-blur-sm" />

            {/* Flash */}
            <motion.div initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.8 }}
                className={`absolute inset-0 ${correct ? 'bg-emerald-500/20' : 'bg-red-500/20'}`} />

            <div className="relative flex flex-col items-center">
                <motion.div initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                    className="text-[8rem] mb-2 drop-shadow-2xl">{correct ? '✅' : '❌'}</motion.div>

                <motion.div initial={{ scale: 0.4, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
                    transition={{ delay: 0.12, type: 'spring', stiffness: 280 }}>
                    <span className={`text-[7rem] font-black drop-shadow-2xl leading-none ${correct ? 'text-white' : 'text-red-400/80'}`}>
                        {score > 0 ? `+${score}` : '0'}
                    </span>
                </motion.div>

                {score > 100 && (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                        className="mt-6 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                        <span className="text-sm font-black text-cyan-400 uppercase tracking-[0.2em] drop-shadow-md">⚡ Speed Master Bonus</span>
                    </motion.div>
                )}

                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                    className={`text-sm font-black mt-6 uppercase tracking-[0.5em] bg-black/40 px-6 py-2 rounded-full ${correct ? 'text-emerald-400/90 border border-emerald-500/30' : 'text-red-400/80 border border-red-500/30'}`}>
                    {correct ? 'Correct Answer' : 'Incorrect'}
                </motion.p>
            </div>
        </motion.div>
    )
}
