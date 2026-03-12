import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
}

const itemVars = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
}

export default function Home() {
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleStart = () => {
        const t = name.trim()
        if (!t) { setError('Enter your name to challenge the void!'); return }
        if (t.length < 2) { setError('Name must be at least 2 characters.'); return }
        navigate('/game', { state: { playerName: t } })
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col relative z-10 overflow-hidden bg-[#030308]"
        >
            {/* Massive Ambient Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />

            {/* Header / Logo Area */}
            <div className="w-full flex items-center justify-between p-6 md:p-10 z-30 relative shrink-0">
                <div className="flex items-center gap-3 md:gap-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 pl-2 pr-6 md:pr-8 py-2 md:py-3 rounded-full overflow-hidden shadow-xl">
                    <div className="bg-white/10 p-2 rounded-full flex items-center justify-center">
                        <img src="/logos/cs.png" alt="IEEE Computer Society Logo" className="h-8 md:h-12 object-contain drop-shadow-md" />
                    </div>
                    <div>
                        <span className="block text-[10px] md:text-sm font-black text-white uppercase tracking-[0.2em] leading-none mb-0.5">
                            IEEE COMPUTER SOCIETY
                        </span>
                        <span className="block text-[9px] md:text-xs font-bold text-cyan-400 tracking-[0.15em] uppercase">
                            Interactive Tournament
                        </span>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/leaderboard')}
                    className="flex flex-col md:flex-row items-center gap-2 md:gap-3 px-6 py-4 bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] transition-all duration-300 shadow-2xl"
                >
                    <span className="text-2xl md:text-3xl leading-none">🏆</span>
                    <span className="text-xs md:text-sm font-black text-white uppercase tracking-widest">Rankings</span>
                </motion.button>
            </div>

            {/* Main Content Arena */}
            <div className="flex-1 flex flex-col justify-center items-center w-full px-6 md:px-12 pb-12 z-20">
                <motion.div variants={containerVars} initial="hidden" animate="show" className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative">

                    {/* Massive Typography Left Side */}
                    <div className="flex-1 text-center lg:text-left w-full">
                        <motion.div variants={itemVars} className="mb-6 md:mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-6">
                                The Ultimate Test
                            </span>
                            <h1 className="text-[12vw] lg:text-[140px] font-black tracking-tighter leading-[0.85] text-white drop-shadow-2xl">
                                <span className="block">REAL</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400 pb-2">
                                    vs AI<span className="text-cyan-400 text-[8vw] lg:text-[80px]">.</span>
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p variants={itemVars} className="text-lg md:text-2xl text-gray-400 font-medium leading-snug max-w-2xl mx-auto lg:mx-0">
                            10 Rounds. 10 Videos. Spot the artificial generation.
                            <br className="hidden md:block" />
                            <span className="text-white">Are your eyes sharp enough to conquer the leaderboard?</span>
                        </motion.p>
                    </div>

                    {/* Action Block Right Side */}
                    <motion.div variants={itemVars} className="w-full max-w-md shrink-0 lg:w-[450px]">
                        <div className="p-1 rounded-[40px] bg-gradient-to-br from-purple-500/30 via-transparent to-cyan-500/30">
                            <div className="bg-[#050510]/80 backdrop-blur-3xl rounded-[36px] p-8 md:p-10 shadow-2xl border border-white/5 relative overflow-hidden">

                                {/* Inner glow */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Enter the Arena</h3>
                                <p className="text-sm text-gray-400 font-medium mb-8">Register your name to track your score.</p>

                                <div className="space-y-6">
                                    <div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => { setName(e.target.value); setError('') }}
                                            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                                            placeholder="Player Name"
                                            maxLength={24}
                                            autoFocus
                                            className="w-full bg-white/[0.04] border border-white/10 focus:border-cyan-500/50 focus:bg-white/[0.08] rounded-2xl px-6 py-5 text-xl font-bold text-white placeholder:text-gray-600 outline-none transition-all shadow-inner"
                                        />
                                        {error && (
                                            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                className="text-red-400 text-sm mt-3 font-bold tracking-wide pl-2">{error}</motion.p>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileTap={{ scale: 0.97 }}
                                        onClick={handleStart}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-black text-lg md:text-xl uppercase tracking-widest shadow-[0_0_40px_rgba(192,132,252,0.4)] transition-all duration-300"
                                    >
                                        Start Game
                                    </motion.button>
                                </div>

                                <div className="mt-8 flex justify-between items-center px-2">
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl mb-1">⚡</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Speed Bonus</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl mb-1">🎯</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Accuracy</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/10" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-2xl mb-1">🏆</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Live Ranks</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </motion.div>
    )
}
