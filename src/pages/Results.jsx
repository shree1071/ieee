import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Confetti from '../components/Confetti'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.2 } }
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
}

export default function Results() {
    const loc = useLocation()
    const nav = useNavigate()
    const { playerName, totalScore, results, avgReaction } = loc.state || {}
    const [showConfetti, setShowConfetti] = useState(false)

    useEffect(() => { setShowConfetti(true) }, [])

    if (!results) { nav('/', { replace: true }); return null }

    const correct = results.filter(r => r.correct).length
    const acc = ((correct / results.length) * 100).toFixed(0)

    const grade = acc >= 90 ? { letter: 'S', color: 'from-amber-300 to-yellow-500', glow: 'shadow-amber-500/30', msg: 'LEGENDARY' }
        : acc >= 70 ? { letter: 'A', color: 'from-emerald-400 to-green-500', glow: 'shadow-emerald-500/30', msg: 'EXCELLENT' }
            : acc >= 50 ? { letter: 'B', color: 'from-blue-400 to-indigo-500', glow: 'shadow-blue-500/30', msg: 'NICE TRY' }
                : { letter: 'C', color: 'from-gray-400 to-gray-600', glow: 'shadow-gray-500/20', msg: 'KEEP GOING' }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center px-5 py-8 relative z-10">
            <Confetti active={showConfetti} />
            <div className="orb orb-a" /><div className="orb orb-b" />

            <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-md relative z-10">

                {/* Grade */}
                <motion.div variants={fadeUp} className="flex flex-col items-center mb-7">
                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 250, damping: 15 }}
                        className={`w-28 h-28 rounded-[30px] bg-gradient-to-br ${grade.color} flex flex-col items-center justify-center shadow-2xl ${grade.glow}`}
                    >
                        <span className="text-5xl font-black text-white drop-shadow-lg">{grade.letter}</span>
                        <span className="text-[8px] font-black text-white/80 uppercase tracking-[0.2em]">{grade.msg}</span>
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.div variants={fadeUp} className="text-center mb-7">
                    <h1 className="text-2xl font-black text-white mb-0.5">Challenge Complete</h1>
                    <p className="text-sm text-gray-500">Well played, <span className="text-purple-300 font-semibold">{playerName}</span></p>
                </motion.div>

                {/* Stats */}
                <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2.5 mb-5">
                    {[
                        { value: totalScore, label: 'Score', icon: '⭐', color: 'text-white' },
                        { value: `${acc}%`, label: 'Accuracy', icon: '🎯', color: 'text-emerald-400' },
                        { value: `${avgReaction}s`, label: 'Speed', icon: '⚡', color: 'text-cyan-400' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                            className="glass rounded-2xl py-4 px-3 text-center">
                            <span className="text-xl block mb-1">{s.icon}</span>
                            <p className={`text-2xl font-black num ${s.color}`}>{s.value}</p>
                            <p className="text-[9px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">{s.label}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Rounds */}
                <motion.div variants={fadeUp} className="glass-strong rounded-2xl p-4 mb-5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rounds</span>
                        <span className="text-[10px] text-gray-600">{correct}/{results.length} correct</span>
                    </div>
                    <div className="space-y-1">
                        {results.map((r, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + i * 0.04 }}
                                className={`flex items-center justify-between py-2 px-3 rounded-xl text-[13px] ${r.correct ? 'bg-emerald-500/[0.06] border border-emerald-500/10' : 'bg-red-500/[0.06] border border-red-500/10'
                                    }`}>
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[10px] text-gray-600 font-mono w-4">{i + 1}</span>
                                    <span className={`text-[11px] font-bold ${r.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {r.correct ? '✓' : '✗'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[11px] text-gray-500 num">{r.reaction_time.toFixed(2)}s</span>
                                    <span className={`text-[11px] font-black num w-8 text-right ${r.score > 100 ? 'text-cyan-400' : r.score > 0 ? 'text-white/90' : 'text-gray-600'}`}>
                                        +{r.score}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTAs */}
                <motion.div variants={fadeUp} className="flex gap-2.5">
                    <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                        onClick={() => nav('/')} className="btn-cta flex-1 py-3.5 text-white text-sm">
                        Play Again
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                        onClick={() => nav('/leaderboard')} className="btn-outline flex-1 py-3.5 text-gray-300 text-sm">
                        🏆 Rankings
                    </motion.button>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
