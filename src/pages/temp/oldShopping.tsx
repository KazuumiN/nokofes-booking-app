// @ts-nocheck
import { useState } from "react";
import ShoppingForm from "components/shopping/ShoppingForm";
import { shoppingProps, productType } from "types";

interface Props {
  id: string;
  shoppingData: shoppingProps;
  returnToHome: () => void;
}

const products: productType[] = [
  {
    id: 1,
    name: "農工大クラフト（サワー）",
    description: "「農工大クラフト」は、農学部のブルーベリーと工学部の超音波熟成技術を生かした「農工融合」の商品。サワーは〜〜で〜〜です。この機会にぜひお試しあれ！！",
    unit: "330mLx1本",
    imageUrl: "https://lh3.googleusercontent.com/3i2yUWvyW3m1LwcnHqC2ZMChj1tFPRZCRvJt6rDj7PKfTXejTeSRPz9GDrq31A4G2aNH4FgwArALAsfrm1M9usigEaZssKDfrYGcrQeJrhbynTj_ab-Vz7S5r4qdCPGReA=w418",
    price: 1000,
    stock: 30,
    limit: 0,
  },
  {
    id: 2,
    name: "商品名",
    description: "「農工大クラフト」は、農学部のブルーベリーと工学部の超音波熟成技術を生かした「農工融合」の商品。サワーは〜〜で〜〜です。この機会にぜひお試しあれ！！",
    unit: "330mLx1本",
    imageUrl: "https://lh3.googleusercontent.com/3i2yUWvyW3m1LwcnHqC2ZMChj1tFPRZCRvJt6rDj7PKfTXejTeSRPz9GDrq31A4G2aNH4FgwArALAsfrm1M9usigEaZssKDfrYGcrQeJrhbynTj_ab-Vz7S5r4qdCPGReA=w418",
    price: 1000,
    stock: 10,
    limit: 5,
  },
  {
    id: 3,
    name: "サンプルの商品名",
    description: "「農工大クラフト」は、農学部のブルーベリーと工学部の超音波熟成技術を生かした「農工融合」の商品。サワーは〜〜で〜〜です。この機会にぜひお試しあれ！！",
    unit: "1枚",
    imageUrl: "https://source.unsplash.com/random",
    price: 1000,
    stock: 0,
    limit: 5,
  },
]

const Shopping = ({ id, shoppingData, returnToHome }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const openForm = () => setIsEditing(true);
  const closeForm = () => setIsEditing(false);
  return (
    <>
      {!shoppingData.reserved || isEditing ? (
        <ShoppingForm
          id={id}
          data={shoppingData}
          products={products}
          returnToHome={returnToHome}
          closeForm={closeForm}
        />
      ) : (
        <>ここにShoppingViewがきます</>
      )}
    </>
  )
}

export default Shopping