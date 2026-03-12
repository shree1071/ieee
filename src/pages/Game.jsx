import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { insforge } from '../lib/insforge'
import Countdown from '../components/Countdown'
import VideoPlayer from '../components/VideoPlayer'
import AnswerButtons from '../components/AnswerButtons'
import ScorePopup from '../components/ScorePopup'
import ProgressBar from '../components/ProgressBar'

const TOTAL_ROUNDS = 10

function shuffle(arr) {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

function calcScore(correct, t) {
    if (!correct) return 0
    let s = 100
    if (t < 2) s += 50
    else if (t < 4) s += 30
    else if (t < 6) s += 10
    return s
}

export default function Game() {
    const nav = useNavigate()
    const loc = useLocation()
    const playerName = loc.state?.playerName
    const [phase, setPhase] = useState('loading')
    const [videos, setVideos] = useState([])
    const [round, setRound] = useState(0)
    const [score, setScore] = useState(0)
    const [results, setResults] = useState([])
    const [t0, setT0] = useState(null)
    const [lastScore, setLastScore] = useState(null)
    const [lastCorrect, setLastCorrect] = useState(null)
    const [pid, setPid] = useState(null)
    const [elapsed, setElapsed] = useState(0)
    const [globalScores, setGlobalScores] = useState([])
    const timerRef = useRef(null)

    useEffect(() => { if (!playerName) nav('/', { replace: true }) }, [playerName])

    useEffect(() => {
        if (phase === 'playing' && t0) {
            timerRef.current = setInterval(() => setElapsed((Date.now() - t0) / 1000), 10)
        } else { clearInterval(timerRef.current); }
        return () => clearInterval(timerRef.current)
    }, [phase, t0])

    useEffect(() => {
        if (!playerName) return
            ; (async () => {
                const { data: v } = await insforge.database.from('videos').select('*')
                if (!v?.length) { nav('/', { replace: true }); return }
                const sel = shuffle(v).slice(0, Math.min(TOTAL_ROUNDS, v.length))
                setVideos(sel)

                // Fetch global scores for live rank projection
                const { data: lb } = await insforge.database.from('leaderboard').select('total_score').order('total_score', { ascending: false })
                if (lb) setGlobalScores(lb.map(r => r.total_score).filter(s => s > 0))

                const { data: p } = await insforge.database.from('players').insert([{ name: playerName }]).select()
                if (!p?.length) { nav('/', { replace: true }); return }
                setPid(p[0].id)
                setPhase('countdown')
            })()
    }, [playerName])

    useEffect(() => {
        if (phase === 'countdown') setElapsed(0)
    }, [phase, round])

    useEffect(() => {
        if (videos.length && round < videos.length - 1) {
            const v = document.createElement('video'); v.preload = 'auto'; v.src = videos[round + 1]?.video_url
        }
    }, [round, videos])

    const onCountdownDone = useCallback(() => {
        setPhase('playing');
        setT0(Date.now());
    }, [])

    const onAnswer = useCallback(async (side) => {
        if (phase !== 'playing') return
        const rt = (Date.now() - t0) / 1000
        const cv = videos[round]
        const ok = side === cv.ai_side
        const pts = calcScore(ok, rt)
        setLastScore(pts); setLastCorrect(ok); setScore(prev => prev + pts)
        const entry = { player_id: pid, video_id: cv.id, answer: side, correct: ok, reaction_time: +rt.toFixed(3), score: pts }
        setResults(prev => [...prev, { ...entry, video_url: cv.video_url }])
        insforge.database.from('game_results').insert([entry]).then()
        setPhase('feedback')
        setTimeout(() => {
            if (round + 1 >= videos.length) setPhase('finished')
            else { setRound(r => r + 1); setPhase('countdown') }
        }, 1800)
    }, [phase, t0, videos, round, pid])

    useEffect(() => {
        if (phase !== 'finished') return
            ; (async () => {
                const avg = results.reduce((s, r) => s + r.reaction_time, 0) / results.length
                await insforge.database.from('players').update({ total_score: score, avg_reaction_time: +avg.toFixed(3) }).eq('id', pid)
                nav('/results', { state: { playerName, playerId: pid, totalScore: score, results, avgReaction: avg.toFixed(2) }, replace: true })
            })()
    }, [phase])

    const cv = videos[round]
    const total = videos.length || TOTAL_ROUNDS

    // Calculate live rank projection
    const projectedRank = globalScores.filter(s => s > score).length + 1

    // Detect Rank jumps (adrenaline effect)
    const prevRank = useRef(projectedRank)
    const [rankUpAnim, setRankUpAnim] = useState(false)

    useEffect(() => {
        if (projectedRank < prevRank.current && round > 0) {
            // Rank Improved! Target Acquired!
            setRankUpAnim(true)
            const st = setTimeout(() => setRankUpAnim(false), 900)
            prevRank.current = projectedRank
            return () => clearTimeout(st)
        }
    }, [projectedRank, round])

    // Pace Tracking Logic
    const avgTop10Score = useMemo(() => {
        if (!globalScores.length) return 0;
        const top10 = globalScores.slice(0, 10);
        return top10.reduce((a, b) => a + b, 0) / (top10.length || 1);
    }, [globalScores]);

    const targetPacePerRound = avgTop10Score / total;
    const currentPace = score / (round === 0 ? 1 : round);

    let paceStatus = "Analyzing..."
    let paceColor = "text-gray-500"
    if (round > 0 || score > 0) {
        if (currentPace > targetPacePerRound * 1.1) {
            paceStatus = "ON RECORD PACE"
            paceColor = "text-amber-400 font-black animate-pulse shadow-amber-500 drop-shadow-md"
        } else if (currentPace >= targetPacePerRound) {
            paceStatus = "TOP 10 PACE"
            paceColor = "text-cyan-400 font-bold"
        } else {
            paceStatus = "FALLING BEHIND"
            paceColor = "text-red-400/80 font-semibold"
        }
    }

    if (!playerName) return null

    return (
        <div className={`h-screen w-full flex flex-col items-center px-4 py-2 sm:py-3 relative z-10 overflow-hidden transition-all duration-300 ${rankUpAnim ? 'screen-flash' : ''}`}>
            <div className="orb orb-a" />
            <div className="orb orb-b" />

            {/* COMPACT HUD */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1400px] mb-2 relative z-10 shrink-0">

                <div className="glass rounded-2xl px-5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-3 w-1/3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-sm font-black text-white shadow-lg shadow-purple-500/20 shrink-0">
                            {playerName?.[0]?.toUpperCase()}
                        </div>
                        <div className="hidden sm:flex flex-col min-w-0">
                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em] leading-none mb-0.5 truncate">Player</p>
                            <p className="text-sm font-black text-white leading-none truncate">{playerName}</p>
                        </div>
                    </div>

                    <div className="flex-1 flex justify-center shrink-0 px-2 lg:px-4">
                        {/* THE PACE TRACKER */}
                        <div className="bg-[#030308]/60 px-4 py-1.5 rounded-full border border-white/5 flex flex-col items-center justify-center backdrop-blur-md hidden sm:flex w-full max-w-[200px]">
                            <span className="text-[8px] text-gray-500 font-black uppercase tracking-[0.3em] mb-0.5">Algorithm Prediction</span>
                            <span className={`text-[10px] tracking-widest uppercase ${paceColor}`}>{paceStatus}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 sm:gap-6 w-1/3">
                        <div className="flex items-center gap-2">
                            <div className="hidden xl:flex flex-col items-end">
                                <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest leading-none mb-1">Live Rank</p>
                                {rankUpAnim && <p className="text-[8px] text-purple-400 font-black uppercase tracking-widest shadow-purple-500 animate-pulse leading-none absolute mt-4 text-right">Ranking Up!</p>}
                            </div>
                            <motion.p key={projectedRank}
                                className={`text-xl md:text-3xl font-black num text-right ${rankUpAnim ? 'rank-up' : 'text-gray-200'} transition-colors duration-200`}>
                                #{projectedRank}
                            </motion.p>
                        </div>
                        <div className="w-px h-6 bg-white/[0.08]" />
                        <div className="flex flex-col lg:flex-row lg:items-center gap-1 sm:gap-2">
                            <p className="text-[8px] sm:text-[9px] text-gray-500 font-bold uppercase tracking-widest hidden xl:block">Score</p>
                            <motion.p key={score} initial={{ scale: 1.5, color: '#22d3ee' }} animate={{ scale: 1, color: '#fff' }}
                                className="text-xl sm:text-2xl font-black num text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 leading-none">
                                {score}
                            </motion.p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 mt-2 px-2">
                    <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] shrink-0">
                        Rnd {round + 1}/{total}
                    </span>
                    <ProgressBar current={round + 1} total={total} />
                </div>
            </motion.div>

            {/* MASSIVE UNOBSTRUCTED STAGE */}
            <div className="w-full max-w-[1400px] flex-1 flex flex-col relative z-20 min-h-0">
                {phase === 'loading' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mb-4" />
                        <p className="text-sm font-black text-gray-400 tracking-widest uppercase">Initializing Arena</p>
                    </motion.div>
                )}

                {cv && phase !== 'loading' && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full flex-1 flex flex-col min-h-0 mb-2 relative"
                    >
                        {/* The Video Area - Takes available vertical space minus the controls */}
                        <div className="relative w-full flex-1 rounded-[24px] overflow-hidden shadow-2xl border border-white/[0.08] bg-[#030308] min-h-0">
                            <VideoPlayer
                                src={cv.video_url}
                                isPlaying={phase === 'playing'}
                            />

                            {/* Overlays ON TOP of video */}
                            <AnimatePresence>
                                {phase === 'countdown' && <Countdown onDone={onCountdownDone} />}
                                {phase === 'feedback' && lastScore !== null && (
                                    <ScorePopup score={lastScore} correct={lastCorrect} />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Answer Controls - STRICTLY BELOW the video */}
                        <div className="mt-3 shrink-0 flex flex-col items-center">
                            <div className="w-full max-w-4xl flex items-center justify-between gap-6">

                                <div className="hidden sm:block w-32 text-center shrink-0">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.3em]">
                                        Target
                                    </p>
                                    <p className="text-xs font-black text-white uppercase tracking-wider mt-1">
                                        AI Footage
                                    </p>
                                </div>

                                <div className="flex-1 w-full">
                                    <AnswerButtons onAnswer={onAnswer} disabled={phase !== 'playing'} />
                                </div>

                                <div className="hidden sm:block w-32 text-center shrink-0">
                                    {phase === 'playing' ? (
                                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                            <p className="text-[9px] text-cyan-500/80 font-bold uppercase tracking-[0.2em]">
                                                Bonus
                                            </p>
                                            <p className="text-xs font-black text-white shadow-cyan-500 mt-1 num">
                                                {elapsed < 2 ? '+50 MAX' : elapsed < 4 ? '+30' : elapsed < 6 ? '+10' : '0 pt'}
                                            </p>
                                        </motion.div>
                                    ) : (
                                        <div className="opacity-0">Placeholder</div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
