import { useEffect, useRef, useState } from 'react';
import '../../css/autoscroll.css';

function Autoscroll({ containerRef }) {
    const intervalRef = useRef(null);
    const scrollSpeedRef = useRef(2);

    const [isScrolling, setIsScrolling] = useState(false);
    const [, forceRender] = useState(0); // only for displaying speed

    const startScroll = () => {
        if (intervalRef.current) return;

        intervalRef.current = setInterval(() => {
            containerRef.current?.scrollBy(0, scrollSpeedRef.current);
            if (containerRef.current) {
                const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 1) {
                    stopScroll();
                }
            }
        }, 100);
    };

    const stopScroll = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsScrolling(false);
    };

    const toggleScroll = () => {
        setIsScrolling(prev => {
            const next = !prev;
            next ? startScroll() : stopScroll();
            return next;
        });
    };

    const increaseSpeed = () => {
        scrollSpeedRef.current += 0.5;
        forceRender(v => v + 1); // only updates displayed number
    };

    const decreaseSpeed = () => {
        scrollSpeedRef.current = Math.max(0.5, scrollSpeedRef.current - 0.5);
        forceRender(v => v + 1);
    };

    useEffect(() => {
        return () => stopScroll(); // cleanup on unmount
    }, []);

    return (
        <div className="autoscroll-container">
            <div className="autoscroll-label">Auto-Scroll</div>

            <div className="autoscroll-button" onClick={toggleScroll}>
                {isScrolling ? '❚❚' : '▶'}
            </div>

            <div className="plus-sign" onClick={increaseSpeed}>+</div>
            <div className="scroll-value">{scrollSpeedRef.current / 5}</div>
            <div className="minus-sign" onClick={decreaseSpeed}>-</div>
        </div>
    )
}

export default Autoscroll;