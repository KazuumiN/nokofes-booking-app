const getShopItems = () => {
  const beerProducts = {
    name: "農工大クラフト",
    description: "農工大ルーツのブルーベリーから手絞りで果汁を絞り出し、\n超音波熟成の技術を用いて仕上げました。農工大OBのブルワーさんと共に作り上げた贅沢なクラフトビールです!!",
    items: [
      {
        id: 'original',
        name: 'オリジナル',
        description: 'フルーティで豊かな香りを感じる一杯',
        unit: '330ml',
        price: 900,
      },
      {
        id: 'sour',
        name: 'サワーエール',
        description: '果実と酸味の組み合わせを楽しむ一杯',
        unit: '330ml',
        price: 900,
      }
    ],
  }

  const misonyuProducts = {
    name: "味噌・乳酸菌市",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    items: [
      {
        id: 'miso',
        name: 'エンレイ大豆味噌',
        description: '天然醸造の生味噌をぜひお土産に',
        unit: '900g',
        price: 500,
      },
      {
        id: 'lactic',
        name: '乳酸菌飲料',
        description: "農工大乳牛の搾りたて生乳を使用",
        unit: '500ml',
        price: 500,
      }
    ]
  }
  return {
    beerProducts,
    misonyuProducts,
  }
}

export default getShopItems