import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
    const pct = Math.min((current / total) * 100, 100)

    return (
        <div className="w-full">
            <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: 'linear-gradient(90deg, #7c3aed, #6366f1, #06b6d4)' }}
                >
                    <div className="absolute inset-0 opacity-50"
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 1.8s linear infinite',
                        }}
                    />
                </motion.div>
            </div>
        </div>
    )
}
