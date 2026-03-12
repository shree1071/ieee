import { motion } from 'framer-motion'

export default function AnswerButtons({ onAnswer, disabled }) {
    const btns = [
        {
            side: 'left',
            label: 'LEFT IS AI',
            icon: '👈',
            grad: 'from-orange-500/20 to-amber-700/10 border-orange-500/30 hover:border-orange-400/60 hover:shadow-orange-500/20',
            text: 'text-orange-400',
        },
        {
            side: 'right',
            label: 'RIGHT IS AI',
            icon: '👉',
            grad: 'from-blue-500/20 to-indigo-700/10 border-blue-500/30 hover:border-blue-400/60 hover:shadow-blue-500/20',
            text: 'text-blue-400',
        },
    ]

    return (
        <div className="flex gap-4">
            {btns.map((b, i) => (
                <motion.button
                    key={b.side}
                    id={`answer-${b.side}-btn`}
                    whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
                    whileTap={disabled ? {} : { scale: 0.98 }}
                    onClick={() => !disabled && onAnswer(b.side)}
                    disabled={disabled}
                    className={`flex-1 py-5 rounded-2xl font-black tracking-widest border-2 backdrop-blur-xl
            transition-all duration-300 relative overflow-hidden
            ${disabled
                            ? 'opacity-20 cursor-not-allowed border-white/[0.05] bg-white/[0.02] text-gray-500'
                            : `bg-gradient-to-r ${b.grad} hover:shadow-2xl ${b.text}`
                        }`}
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        <span className="text-3xl">{b.icon}</span>
                        <span className="text-xl md:text-2xl">{b.label}</span>
                    </span>
                </motion.button>
            ))}
        </div>
    )
}
