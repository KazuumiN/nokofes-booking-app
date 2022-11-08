import { useEffect, useState, useRef } from "react";
import VisibilitySensor from "react-visibility-sensor";
import client from "lib/microCMS"
import useSWR from "swr";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'

function GridGalleryCard({ imageUrl, show, selected, setSelected }: { imageUrl: string, show: boolean, selected: string, setSelected: (value: string) => void }) {
  const fileName = decodeURIComponent(imageUrl.split('/').slice(-1)[0].split('.').slice(0,1)[0])
  const isThisSelected = selected === fileName
  return (
    <button
      onClick={() => {
        if (isThisSelected) {
          setSelected('')
        } else {
          setSelected(fileName)
        }
      }}
      className={`relative transition ease-in duration-300 transform border-red-500 ${
        show ? "" : "translate-y-16 opacity-0"
      } ${isThisSelected ? "border-4" : ""}`}
    >
      {/* <div className="absolute inset-0 z-10 flex transition duration-200 ease-in opacity-0 hover:opacity-100">
        <div className="absolute inset-0 bg-black opacity-70"></div>
        <div className="mx-4 text-white text-center z-10 self-center uppercase tracking-widest text-sm">
          
        </div>
      </div> */}
      <img src={`${imageUrl}?fit=fillmax&fill=blur&w=180&h=350`} alt="" />
      <div className="h-12">
        <p className="text-sm text-center" >{fileName}</p>
      </div>
    </button>
  );
}


export default function Index({images}: {images:Array<string>}) {
  const router = useRouter();
  const [imagesShownArray, setImagesShownArray] = useState(Array(images.length).fill(false));
  const [selected, setSelected] = useState('');
  const oldSelected = useRef('');
  useEffect(() => {
    const getVote = async () => {
      const res = await fetch('/api/vote4tatekan').then((res) => res.json());
      const currentVote = res.currentVote ? res.currentVote : '';
      setSelected(currentVote);
      oldSelected.current = currentVote;
    }
    getVote();
  },[])

  const submit = () => {
    const id = toast.loading("送信中...", {
      position: 'bottom-center',
    })
    fetch('/api/vote4tatekan', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vote: selected
      })
    }).then((res) => {
      if (res.status === 200) {
          toast.update(id, {
            render: '投票しました！ご協力ありがとうございます。',
            type: "success",
            isLoading: false,
            position: 'bottom-center',
            draggable: true,
            autoClose: 3000,
            closeOnClick: true,
        })
        router.push('/');
      } else {
        toast.update(id, {
          render: 'エラーが発生したため再読み込みしました。連続して発生する場合、しばらく時間をおいてから再度お試しください。',
          type: 'error',
          isLoading: false,
          position: 'bottom-center',
          draggable: true,
          autoClose: 5000
        })
        router.reload();
      }
    });
  }

  const imageVisibleChange = (index: number, isVisible: any) => {
    if (isVisible) {
      setImagesShownArray((currentImagesShownArray) => {
        currentImagesShownArray[index] = true;
        return [...currentImagesShownArray];
      });
    }
  };

  return (
    <>
      <div className="w-full flex flex-col items-center my-3">
        <h1 className="text-3xl">タテカン投票</h1>
        <p className="text-lg">　あなたがいいと思ったタテカンを<br/>タップしてください！</p>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {images &&
          images.map((imageUrl, index) => (
            <VisibilitySensor
              key={index}
              partialVisibility={true}
              offset={{ bottom: 80 }}
              onChange={(isVisible: any) => imageVisibleChange(index, isVisible)}
            >
              <GridGalleryCard
                imageUrl={imageUrl}
                show={imagesShownArray[index]}
                selected={selected}
                setSelected={setSelected}
              />
            </VisibilitySensor>
          ))}
      </div>
      {selected !== '' &&
        <button
          type="button"
          className="fixed bottom-3 right-3  inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-600"
          onClick={submit}
          disabled={selected === oldSelected.current}
        >
          <PaperAirplaneIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
          <span>{selected === oldSelected.current ? `${selected}は投票済みです` : `${selected}に投票する`}</span>
        </button>
      }
    </>
  );
}

export async function getStaticProps() {
  // microcmsから全ての画像を取得
  const key = process.env.MICROCMS_API_KEY_GET_ONLY || ''
  const data = await fetch('https://nokofes-board.microcms-management.io/api/v1/media?limit=100', {
      headers: {
          'X-MICROCMS-API-KEY': key
      }
  }).then(res => res.json());
  return {
    props: {
      images: data.media.map((image:any) => image.url),
      // status: true
    },
  }
}