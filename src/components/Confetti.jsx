import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Confetti({ active }) {
    const [pieces, setPieces] = useState([])

    useEffect(() => {
        if (!active) return
        const colors = ['#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#22c55e', '#6366f1', '#f472b6']
        const arr = []
        for (let i = 0; i < 50; i++) {
            arr.push({
                id: i,
                x: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 0.5,
                size: Math.random() * 6 + 4,
                rotation: Math.random() * 360,
                duration: Math.random() * 2 + 2,
            })
        }
        setPieces(arr)
    }, [active])

    if (!active) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {pieces.map(p => (
                <motion.div
                    key={p.id}
                    initial={{
                        x: `${p.x}vw`,
                        y: -20,
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: '110vh',
                        rotate: p.rotation + 720,
                        opacity: [1, 1, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        ease: 'linear',
                    }}
                    style={{
                        position: 'absolute',
                        width: p.size,
                        height: p.size * 1.4,
                        backgroundColor: p.color,
                        borderRadius: '1px',
                    }}
                />
            ))}
        </div>
    )
}
