import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { insforge } from '../lib/insforge'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } }
}
const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
}

export default function Leaderboard() {
    const nav = useNavigate()
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        ; (async () => {
            const { data } = await insforge.database.from('leaderboard').select('*')
            if (data) setPlayers(data.filter(p => p.total_score > 0))
            setLoading(false)
        })()
    }, [])

    const badge = (i) => {
        if (i === 0) return { bg: 'from-amber-300 to-yellow-500', text: 'text-amber-200', icon: '👑', border: 'border-amber-500/30' }
        if (i === 1) return { bg: 'from-gray-300 to-gray-500', text: 'text-gray-200', icon: '🥈', border: 'border-gray-400/30' }
        if (i === 2) return { bg: 'from-orange-400 to-amber-600', text: 'text-amber-200', icon: '🥉', border: 'border-orange-500/30' }
        return { bg: 'from-gray-700 to-gray-800', text: 'text-gray-400', icon: null, border: 'border-transparent' }
    }

    const filteredPlayers = useMemo(() => {
        if (!search) return players
        return players.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    }, [search, players])

    const globalAvgScore = players.length > 0 ? Math.round(players.reduce((a, b) => a + b.total_score, 0) / players.length) : 0
    const globalAvgSpeed = players.length > 0 ? (players.reduce((a, b) => a + b.avg_reaction_time, 0) / players.length).toFixed(2) : 0

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center px-4 py-6 relative z-10 overflow-x-hidden">
            <div className="orb orb-a opacity-60" /><div className="orb orb-b opacity-60" />

            <div className="absolute top-0 left-0 z-30 flex items-center p-6 md:p-8">
                <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 pl-2 pr-6 py-2 rounded-full overflow-hidden shadow-xl">
                    <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                        <img src="/logos/cs.png" alt="IEEE Computer Society Logo" className="h-8 md:h-10 object-contain drop-shadow-md" />
                    </div>
                    <div className="hidden sm:flex flex-col justify-center">
                        <span className="block text-[10px] md:text-xs font-black text-cyan-400 uppercase tracking-widest leading-none mb-0.5">
                            IEEE COMPUTER SOCIETY
                        </span>
                    </div>
                </div>
            </div>

            <motion.div variants={stagger} initial="hidden" animate="show" className="w-full max-w-5xl relative z-10 mt-20 md:mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12">

                {/* Left Column: Podium & Stats */}
                <div className="flex-1 flex flex-col items-center lg:items-end">

                    <motion.div variants={fadeUp} className="text-center lg:text-right mb-6 w-full max-w-sm">
                        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="inline-flex items-center justify-center text-5xl mb-2 drop-shadow-2xl">🏆</motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">Hall of Fame</h1>
                        <p className="text-sm text-cyan-400 font-bold uppercase tracking-widest">Global Rankings</p>
                    </motion.div>

                    {/* Podium (top 3) */}
                    {!loading && players.length >= 3 && (
                        <motion.div variants={fadeUp} className="flex items-end justify-center lg:justify-end gap-6 sm:gap-10 w-full max-w-2xl px-2 mb-8 mt-12">
                            {/* 2nd */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-[0_0_40px_rgba(156,163,175,0.4)] border border-white/20">2</div>
                                <p className="text-sm font-black text-gray-300 truncate max-w-[160px] uppercase tracking-wider">{players[1].name}</p>
                                <p className="text-4xl font-black text-white num mt-1">{players[1].total_score}</p>
                                <div className="w-full max-w-[140px] h-40 mt-4 rounded-t-3xl bg-gradient-to-t from-gray-500/30 to-transparent border border-gray-400/30 border-b-0 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                </div>
                            </div>
                            {/* 1st */}
                            <div className="flex-[1.2] flex flex-col items-center z-10 -mx-4">
                                <motion.div animate={{ scale: [1, 1.05, 1], y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}
                                    className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-6xl shadow-[0_0_80px_rgba(245,158,11,0.6)] mb-4 border-2 border-yellow-200/50 relative z-20">👑</motion.div>
                                <p className="text-lg font-black text-amber-300 truncate max-w-[200px] uppercase tracking-[0.2em] drop-shadow-md z-20 relative">{players[0].name}</p>
                                <p className="text-6xl font-black text-white num drop-shadow-[0_0_30px_rgba(245,158,11,0.5)] z-20 relative mt-1">{players[0].total_score}</p>
                                <div className="w-full max-w-[180px] h-60 mt-4 rounded-t-3xl bg-gradient-to-t from-amber-500/40 to-transparent border border-amber-400/50 border-b-0 backdrop-blur-lg relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-500 via-yellow-200 to-yellow-500 shadow-[0_0_30px_rgba(253,224,71,1)]" />
                                </div>
                            </div>
                            {/* 3rd */}
                            <div className="flex-1 flex flex-col items-center">
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-amber-700 flex items-center justify-center text-3xl font-black text-white mb-4 shadow-[0_0_40px_rgba(249,115,22,0.4)] border border-white/20">3</div>
                                <p className="text-sm font-black text-amber-500 truncate max-w-[160px] uppercase tracking-wider">{players[2].name}</p>
                                <p className="text-4xl font-black text-white num mt-1">{players[2].total_score}</p>
                                <div className="w-full max-w-[140px] h-28 mt-4 rounded-t-3xl bg-gradient-to-t from-orange-500/30 to-transparent border border-orange-500/30 border-b-0 backdrop-blur-md relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Global Event Stats Block */}
                    {!loading && players.length > 0 && (
                        <motion.div variants={fadeUp} className="w-full max-w-sm grid grid-cols-2 gap-3 mb-10 mx-auto lg:mx-0 lg:mr-8 mt-4 lg:mt-0">
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Challengers</p>
                                <p className="text-2xl font-black text-white num">{players.length}</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Score</p>
                                <p className="text-2xl font-black text-purple-400 num">{globalAvgScore}</p>
                            </div>
                            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-center col-span-2">
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Community Speed Average</p>
                                <p className="text-2xl font-black text-cyan-400 num">{globalAvgSpeed}<span className="text-sm text-cyan-400/50">s</span></p>
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* Right Column: List & Search */}
                <div className="flex-1 w-full max-w-md mx-auto lg:mx-0 flex flex-col">

                    {/* Search Bar */}
                    <motion.div variants={fadeUp} className="mb-4 relative">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 text-lg">
                            🔍
                        </div>
                        <input
                            type="text"
                            placeholder="Find your rank..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#050510]/80 backdrop-blur-xl border border-white/10 focus:border-cyan-500/50 rounded-2xl py-4 pl-12 pr-4 text-white font-semibold placeholder:text-gray-600 outline-none transition-all shadow-xl"
                        />
                    </motion.div>

                    {/* Full list */}
                    <motion.div variants={fadeUp} className="glass-strong rounded-[24px] overflow-hidden flex-1 flex flex-col min-h-[400px]">
                        <div className="flex items-center px-5 py-3 border-b border-white/[0.08] bg-white/[0.02] text-[10px] text-gray-400 uppercase tracking-widest font-black shrink-0">
                            <span className="w-10">Rank</span>
                            <span className="flex-1">Challenger</span>
                            <span className="w-16 text-right">Score</span>
                            <span className="w-16 text-right">Speed</span>
                        </div>

                        {loading ? (
                            <div className="flex-1 flex justify-center items-center">
                                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
                            </div>
                        ) : filteredPlayers.length === 0 ? (
                            <div className="flex-1 flex flex-col justify-center items-center p-8 text-center text-gray-500">
                                <p className="text-4xl mb-4 opacity-30">👻</p>
                                <p className="text-sm font-bold uppercase tracking-widest">{search ? 'No hackers found' : 'Arena is empty'}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04] overflow-y-auto flex-1 p-2">
                                <AnimatePresence>
                                    {filteredPlayers.map((p) => {
                                        // Find true rank index from original un-filtered array
                                        const trueIndex = players.findIndex(orig => orig.id === p.id)
                                        const b = badge(trueIndex)

                                        return (
                                            <motion.div key={p.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className={`flex items-center px-3 py-3 rounded-xl mb-1 transition-all hover:bg-white/[0.05] border ${b.border} ${trueIndex < 3 ? 'bg-white/[0.02]' : ''}`}>
                                                <div className="w-8 shrink-0 flex justify-center">
                                                    {b.icon ? <span className="text-base drop-shadow-md">{b.icon}</span> : <span className="text-xs text-gray-600 font-black num">{trueIndex + 1}</span>}
                                                </div>
                                                <div className="flex-1 flex items-center gap-3 min-w-0 pr-2">
                                                    <div className={`w-8 h-8 rounded-[10px] bg-gradient-to-br ${b.bg} flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-md`}>
                                                        {p.name[0]?.toUpperCase()}
                                                    </div>
                                                    <span className={`text-sm font-bold truncate tracking-wide ${b.text}`}>{p.name}</span>
                                                </div>
                                                <span className="w-16 text-right text-base font-black text-white num">{p.total_score}</span>
                                                <span className="w-14 text-right text-xs font-bold text-gray-500 num ml-2">{p.avg_reaction_time.toFixed(2)}s</span>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>

                    {/* CTA */}
                    <motion.div variants={fadeUp} className="mt-6 flex justify-center w-full">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => nav('/')} className="btn-cta w-full py-4 text-white text-sm font-black uppercase tracking-widest shadow-2xl">
                            Return to Arena
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    )
}

