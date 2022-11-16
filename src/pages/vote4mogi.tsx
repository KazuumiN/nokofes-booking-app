// 参考にしたコード
// https://codesandbox.io/s/71f3j

import { useEffect, useState, useRef } from "react";
import VisibilitySensor from "react-visibility-sensor";
import client from "lib/microCMS"
import useSWR from "swr";
import { toast } from "react-toastify";
import { useRouter } from 'next/router';
import { PaperAirplaneIcon } from '@heroicons/react/20/solid'

function MogiCard({ mogiName, mogiMenu, selected, setSelected }: { mogiName: string, mogiMenu: string, selected: string, setSelected: (value: string) => void }) {
  const isThisSelected = selected === mogiName
  return (
    <button
      onClick={() => {
        if (isThisSelected) {
          setSelected('')
        } else {
          setSelected(mogiName)
        }
      }}
      className={`relative transition ease-in duration-300 transform border-red-500 flex items-center space-x-3 rounded-lg bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 ${isThisSelected ? "border-4" : ""}`}
    >
      <div className="min-w-0 flex-1">
        <a href="#" className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <p className="text-sm font-medium text-gray-900">{mogiName}</p>
          <p className="truncate text-sm text-gray-500">{mogiMenu}</p>
        </a>
      </div>
    </button>
  );
}


export default function Index({mogis}: {mogis:Array<{name: string, menu: string}>}) {
  const router = useRouter();
  const [selected, setSelected] = useState('');
  const oldSelected = useRef('');
  useEffect(() => {
    const getVote = async () => {
      const res = await fetch('/api/vote4mogi').then((res) => res.json());
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
    fetch('/api/vote4mogi', {
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
          render: '模擬店大賞に投票しました！ありがとうございました！',
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

  return (
    <>
      <div className="w-full flex flex-col items-center my-3">
        <h1 className="text-3xl">模擬店投票</h1>
        <p className="text-lg">　あなたがいいと思った模擬店を<br/>選んでください！</p>
      </div>
      <div className="grid grid-cols-2 gap-1 mb-6">
        {mogis &&
          mogis.map((mogi, index) => (
            <MogiCard
              key={index}
              mogiName={mogi.name}
              mogiMenu={mogi.menu}
              selected={selected}
              setSelected={setSelected}
            />
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
  const mogis = [
    {
      name: "園芸学研究室",
      menu: "シクラメンや花加工品"
    },
    {
      name: "野菜市",
      menu: "野菜"
    },
    {
      name: "味噌・乳酸菌市",
      menu: "生みそ、乳酸菌飲料"
    },
    {
      name: "農工大クラフト",
      menu: "ビール"
    },
    {
      name: "バラ会",
      menu: "ポプリ"
    },
    {
      name: "棚田塾",
      menu: "お米、野菜、豆菓子の販売"
    },
    {
      name: "変わり種工房",
      menu: "七味"
    },
    {
      name: "くまのみ",
      menu: "輪投げ"
    },
    {
      name: "歌研究会",
      menu: "ごまだんご"
    },
    {
      name: "サッカー部",
      menu: "フランクフルト"
    },
    {
      name: "鈴木研究室",
      menu: "コオロギの竜田揚げ"
    },
    {
      name: "剣道部",
      menu: "焼き鳥"
    },
    {
      name: "準硬式野球部",
      menu: "塩焼きそば"
    },
    {
      name: "自転車部",
      menu: "広島風お好み焼き"
    },
    {
      name: "陸上競技部",
      menu: "サーターアンダギー"
    },
    {
      name: "竹桐会",
      menu: "あげ大福"
    },
    {
      name: "MOWゼミ",
      menu: "わらび餅"
    },
    {
      name: "S.P.C.",
      menu: "揚げ餅"
    },
    {
      name: "森の派出所",
      menu: "餃子ピザ"
    },
    {
      name: "植物病理学研究室",
      menu: "イタリアン焼きそば"
    },
    {
      name: "獣医毒性学研究室",
      menu: "餃子・透明標本"
    },
    {
      name: "食農ゼミ",
      menu: "燻製ベーコン"
    },
    {
      name: "ワンダーフォーゲル部",
      menu: "玉こんにゃく"
    },
    {
      name: "養蜂サークル",
      menu: "ワッフル"
    },
    {
      name: "バスケットボール部",
      menu: "タピオカ"
    },
    {
      name: "合気道部",
      menu: "おしるこ"
    },
    {
      name: "ミニホースの会",
      menu: "アップルパイ"
    },
    {
      name: "ロボット研究会",
      menu: "射的"
    },
    {
      name: "Arrows",
      menu: "フランクフルト"
    },
    {
      name: "硬式庭球部",
      menu: "やきそば"
    },
    {
      name: "水泳部",
      menu: "じゃがバター"
    },
    {
      name: "Buddy Club",
      menu: "Funnel Cake"
    },
    {
      name: "弓道部",
      menu: "フリフリポテト"
    },
    {
      name: "児童文化研究会",
      menu: "わたあめ"
    },
    {
      name: "Foc's",
      menu: "タピオカミルクティー"
    },
    {
      name: "遺伝子制御学研究室",
      menu: "鶏の塩麹焼き"
    },
    {
      name: "林科の焼き鳥",
      menu: "やきとり"
    },
    {
      name: "食品化学研究室",
      menu: "串カツ"
    },
    {
      name: "ツーリングカヌー部",
      menu: "たこ焼き"
    },
    {
      name: "狩り部",
      menu: "鹿串カツ"
    },
    {
      name: "外来生物研究会",
      menu: "ザリガニパエリア"
    },
    {
      name: "テコンドー部",
      menu: "チゲうどん"
    },
    {
      name: "走ろう会",
      menu: "おでん"
    },
    {
      name: "オリエンテーリング部",
      menu: "からあげ"
    },
    {
      name: "空手道部",
      menu: "大学芋"
    },
    {
      name: "弓を引き隊",
      menu: "たいやき"
    },
    {
      name: "ハンググライダー部	クレープ"
    },
    {
      name: "吹奏楽団",
      menu: "チュロス"
    },
    {
      name: "Four Seasons",
      menu: "カフェドリンク"
    },
    {
      name: "管弦楽団",
      menu: "ベビーカステラ"
    },
    {
      name: "63代学祭委員",
      menu: "旨辛！肉みそ丼"
    },
    {
      name: "バレーボール部",
      menu: "はしまき"
    },
    {
      name: "スキー部",
      menu: "天ぷらアイス"
    },
    {
      name: "耕地の会",
      menu: "芋きんつば"
    },
    {
      name: "少林寺拳法部",
      menu: "ベビーカステラ"
    },
    {
      name: "ピアノ部",
      menu: "チョコバナナ"
    }
  ]
  return {
    props: {
      mogis
      // status: true
    },
  }
}