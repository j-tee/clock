import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

interface TimeSetterProps {
    time: number;
    setTime: (time: number) => void;
    min: number;
    max: number;
    interval: number;
    type: 'break' | 'session';
}

const TimeSetter: React.FC<TimeSetterProps> = ({
    time,
    setTime,
    min,
    max,
    interval,
    type,
}) => {
    return (
        <div>
            <button
                onClick={() => time > min && setTime(time - interval)}
                id={`${type}-decrement`}
                disabled={time <= min}
                aria-label={`Decrease ${type} time`}
            >
                <FaArrowDown />
            </button>

            <span id={`${type}-length`}>{time / interval}</span>

            <button
                onClick={() => time < max && setTime(time + interval)}
                id={`${type}-increment`}
                disabled={time >= max}
                aria-label={`Increase ${type} time`}
            >
                <FaArrowUp />
            </button>
        </div>
    );
};

export default TimeSetter;
