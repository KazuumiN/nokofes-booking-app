import { useTimer } from 'react-timer-hook';
import Image from 'next/image';
import HakkenKokenImage from 'assets/HakkenKoken.jpg';
//{ expiryTimestamp }: { expiryTimestamp: Date }
const Timer = ({expiryTimestamp}:any) => {

  const {
    seconds,
    minutes,
    hours,
  } = useTimer({ expiryTimestamp, onExpire: () => location.reload() });


  return (
    <div className="flex flex-col items-center justify-center m-3">
      <div className="text-sm md:text-2xl font-extralight text-center mr-8">予約開始まで</div>
      <div className="text-2xl md:text-7xl text-center flex w-full items-center justify-center">
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
      {/* img.jpgを表示する */}
      <Image className="w-full md:w-2/3 lg:w-1/2" src={HakkenKokenImage} alt="" />
    </div>
  );
}

export default Timer;