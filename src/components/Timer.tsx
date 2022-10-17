import { useTimer } from 'react-timer-hook';
import Image from 'next/image';
import HakkenKokenImage from 'assets/HakkenKoken.jpg';
//{ expiryTimestamp }: { expiryTimestamp: Date }
const Timer = () => {
  const expiryTimestamp = new Date("2022-10-21T12:00:00+0900");

  const {
    seconds,
    minutes,
    hours,
    days,
  } = useTimer({ expiryTimestamp, onExpire: () => location.reload() });


  return (
    <div className="flex flex-col items-center justify-center m-3">
      <div className="text-lg md:text-2xl font-extralight text-center mr-8">予約再開まで</div>
      <div className="text-2xl md:text-7xl text-center flex w-full items-center justify-center">
        <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
            <div className="font-mono leading-none" x-text="days">{days}</div>
            <div className="font-mono text-md md:text-3xl ">日</div>
        </div>
        <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
            <div className="font-mono leading-none" x-text="hours">{hours}</div>
            <div className="font-mono text-md md:text-3xl ">時間</div>
        </div>
        <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
            <div className="font-mono leading-none" x-text="minutes">{minutes}</div>
            <div className="font-mono text-md md:text-3xl ">分</div>
        </div>
        <div className="w-24 mx-1 p-2 bg-white text-green-500 rounded-lg">
            <div className="font-mono leading-none" x-text="seconds">{seconds}</div>
            <div className="font-mono text-md md:text-3xl ">秒</div>
        </div>
      </div>
    </div>
  );
}

export default Timer;