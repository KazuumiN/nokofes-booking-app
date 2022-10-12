
// @ts-nocheck
import { useState } from "react";
import ShoppingForm from "pages/shopping/edit";
import { shoppingProps, productType } from "types";
import { useSession } from 'next-auth/react'; 
import useSWR from "swr";
// @ts-ignore
const fetcher = (...args) => fetch(...args).then(res => res.json())


interface Props {
  id: string;
  shoppingData: shoppingProps;
}
const Wrapper = () => {
  const { data, error } = useSWR('/api/shopping', fetcher);
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>Loading...</p>;
  return (
    <Shopping shoppingData={data} />
  )
}

const beerProducts = {
  id: 'beer',
  name: "農工大クラフト",
  description: "芳醇なブルーベリーと超音波熟成の技術を使い、本場オレゴンで腕に磨きをかけたブルワーさんと共に贅沢な一品を完成させました！",
  unit: "330ml",
  imageUrl: "https://lh3.googleusercontent.com/fife/AAbDypDwFObVTy8e5kc8TugTc1XV0Qcc87qHTz03svnBcIwe_8oQXRHO271_xpaucIag63nX-l54xIQhLy3Gjv1psfBMl-pJ-Jg50cJ6L9nMCPWMedZauD4xY-j5wXMSzHms1sektef4utHtXPK03K2jT02B7z3cM1BCx1ZaHuWqwQ8gKmo9flwMLu31Lo2K-1ZPFFlqY9SUrt3_N7oMl8OohSCwXYqYmdVH6S_24Brf5u-LprjZOVY_lXLMP5CSAwFj22tvczbRs3fzRlsAVUQV7pNXXoBL4LAdfGM7EG-zaieVBfuYbI5aQ9qfob25P7TLADn-7ciPhCsF3Qz3wEA-Lz-7T8QFShqRIrx8-NB098sg3IthslkFHqSc1TQusue83kbwZgjOKM9_p585A1zqQ-OtQzYzLiUYiCOXTIVBryGqFIJuH_Zq-UQn8WuBtq_AbyZgiq0rjXNFjGLBbbPGuOXSTMo9YI-NWszlfpPwC98u6hh4kUtHWy9zQUCzXQjH1BclYefxafUJy4uz2bRYptaXgZxvMaVP44M_orTS0UYLcFcskoyaa22S5uaj4zMv4U8ciGH75UGBCj4oRFgzSKBa1rAT6qj3dn2lqnUrJaHaMW0ip3ChdzyW5LR-sRefeAtNW4LJyhyXDCB61t9QTEPU81mC9t0umz5yl73s-QNWJpa56OjLPEOSUeK2AYQhuP9-HMXI85vrnqcK2g1qBCwbWd78yxO5iCGuRTqVmIHn-A1RxkrWt01-eIdcmLEy-thua9uVVqRVfnIqmtRqtWiKO3fCnWt0y8jouokZYfwoZ30rfO4KDN4Gbor3UclNMGUsGcuX8ZyxF-N3TzZNUFLRhw5IKF6-KE_x46mQ8IJa2nfuQFKq6duwN9ndpAdcF8wN5cpNtj7ZTc7kP4-dEQW15ytTe8DDXhaR3wED4NprhjimFd-7btRobwEJWdmLaWCaQDCo9H2EkivwLmBHntm1vM3MCnqmnpkB0j8n0GuNiPbZS0m49jOIj3GYgfdrtsOLdOMe05i_bvRZOxCQ5a1Dfyxv3icqIA5R0pd7ZGNBAAOiFRTWcGhuTPW4PA_9TKDn9-wP0zz9yt9_J3pqeHKlP729M7sijfW9jRE75wiUJ_RKpaTPrOKUdyDNFD7-52tE9a9zZiJ_9bp-SfW2RoJ36fZItS_0B0lZlDhGA2x02nXl1VyijOOphuFzSk5CY9dEBqw1RRBWdd45gmV4lxrtHc-Wv5ZFKlHxfoVSO2U9hIYXkA8vD_pj841sKOPVXo4DQM9ExJOzU4e6ye-HdZR-ey17ghLAQdBMEQEM6Qq3-NhtgvoF7CjuMhysS5_eFft0208pq-2GchCOKV6g5tJWy5FZwcokQHsq5-D6OUX9v-hjoCkBzguGB7Mke_TnA0VV82hIdcXQevk680Gw7gNv0b289AsDKM2fSoCIkgS6WFv3lWPlkUxjgFW0-ltw1p66CrEffmQV=w2879-h1639",
  items: [
    {
      id: 'original',
      name: 'オリジナル',
      unit: '330ml',
      price: 900,
      stock: 150,
    },
    {
      id: 'sour',
      name: 'サワー',
      unit: '330ml',
      price: 900,
      stock: 150,
    }
  ],
}

const products: productType[] = [
  // {
  //   id: 1,
  //   name: "農工大クラフト　オリジナル",
  //   description: "芳醇なブルーベリーと超音波熟成の技術を使い、本場オレゴンで腕に磨きをかけたブルワーさんと共に贅沢な一品を完成させました！",
  //   unit: "1本",
  //   imageUrl: "https://lh3.googleusercontent.com/fife/AAbDypDwFObVTy8e5kc8TugTc1XV0Qcc87qHTz03svnBcIwe_8oQXRHO271_xpaucIag63nX-l54xIQhLy3Gjv1psfBMl-pJ-Jg50cJ6L9nMCPWMedZauD4xY-j5wXMSzHms1sektef4utHtXPK03K2jT02B7z3cM1BCx1ZaHuWqwQ8gKmo9flwMLu31Lo2K-1ZPFFlqY9SUrt3_N7oMl8OohSCwXYqYmdVH6S_24Brf5u-LprjZOVY_lXLMP5CSAwFj22tvczbRs3fzRlsAVUQV7pNXXoBL4LAdfGM7EG-zaieVBfuYbI5aQ9qfob25P7TLADn-7ciPhCsF3Qz3wEA-Lz-7T8QFShqRIrx8-NB098sg3IthslkFHqSc1TQusue83kbwZgjOKM9_p585A1zqQ-OtQzYzLiUYiCOXTIVBryGqFIJuH_Zq-UQn8WuBtq_AbyZgiq0rjXNFjGLBbbPGuOXSTMo9YI-NWszlfpPwC98u6hh4kUtHWy9zQUCzXQjH1BclYefxafUJy4uz2bRYptaXgZxvMaVP44M_orTS0UYLcFcskoyaa22S5uaj4zMv4U8ciGH75UGBCj4oRFgzSKBa1rAT6qj3dn2lqnUrJaHaMW0ip3ChdzyW5LR-sRefeAtNW4LJyhyXDCB61t9QTEPU81mC9t0umz5yl73s-QNWJpa56OjLPEOSUeK2AYQhuP9-HMXI85vrnqcK2g1qBCwbWd78yxO5iCGuRTqVmIHn-A1RxkrWt01-eIdcmLEy-thua9uVVqRVfnIqmtRqtWiKO3fCnWt0y8jouokZYfwoZ30rfO4KDN4Gbor3UclNMGUsGcuX8ZyxF-N3TzZNUFLRhw5IKF6-KE_x46mQ8IJa2nfuQFKq6duwN9ndpAdcF8wN5cpNtj7ZTc7kP4-dEQW15ytTe8DDXhaR3wED4NprhjimFd-7btRobwEJWdmLaWCaQDCo9H2EkivwLmBHntm1vM3MCnqmnpkB0j8n0GuNiPbZS0m49jOIj3GYgfdrtsOLdOMe05i_bvRZOxCQ5a1Dfyxv3icqIA5R0pd7ZGNBAAOiFRTWcGhuTPW4PA_9TKDn9-wP0zz9yt9_J3pqeHKlP729M7sijfW9jRE75wiUJ_RKpaTPrOKUdyDNFD7-52tE9a9zZiJ_9bp-SfW2RoJ36fZItS_0B0lZlDhGA2x02nXl1VyijOOphuFzSk5CY9dEBqw1RRBWdd45gmV4lxrtHc-Wv5ZFKlHxfoVSO2U9hIYXkA8vD_pj841sKOPVXo4DQM9ExJOzU4e6ye-HdZR-ey17ghLAQdBMEQEM6Qq3-NhtgvoF7CjuMhysS5_eFft0208pq-2GchCOKV6g5tJWy5FZwcokQHsq5-D6OUX9v-hjoCkBzguGB7Mke_TnA0VV82hIdcXQevk680Gw7gNv0b289AsDKM2fSoCIkgS6WFv3lWPlkUxjgFW0-ltw1p66CrEffmQV=w2879-h1639",
  //   price: 900,
  //   stock: 150,
  //   limit: 0,
  // },
  // {
  //   id: 2,
  //   name: "農工大クラフト　サワーエール",
  //   description: "芳醇なブルーベリーと超音波熟成の技術を使い、本場オレゴンで腕に磨きをかけたブルワーさんと共に贅沢な一品を完成させました！",
  //   unit: "1本",
  //   imageUrl: "https://lh3.googleusercontent.com/fife/AAbDypDwFObVTy8e5kc8TugTc1XV0Qcc87qHTz03svnBcIwe_8oQXRHO271_xpaucIag63nX-l54xIQhLy3Gjv1psfBMl-pJ-Jg50cJ6L9nMCPWMedZauD4xY-j5wXMSzHms1sektef4utHtXPK03K2jT02B7z3cM1BCx1ZaHuWqwQ8gKmo9flwMLu31Lo2K-1ZPFFlqY9SUrt3_N7oMl8OohSCwXYqYmdVH6S_24Brf5u-LprjZOVY_lXLMP5CSAwFj22tvczbRs3fzRlsAVUQV7pNXXoBL4LAdfGM7EG-zaieVBfuYbI5aQ9qfob25P7TLADn-7ciPhCsF3Qz3wEA-Lz-7T8QFShqRIrx8-NB098sg3IthslkFHqSc1TQusue83kbwZgjOKM9_p585A1zqQ-OtQzYzLiUYiCOXTIVBryGqFIJuH_Zq-UQn8WuBtq_AbyZgiq0rjXNFjGLBbbPGuOXSTMo9YI-NWszlfpPwC98u6hh4kUtHWy9zQUCzXQjH1BclYefxafUJy4uz2bRYptaXgZxvMaVP44M_orTS0UYLcFcskoyaa22S5uaj4zMv4U8ciGH75UGBCj4oRFgzSKBa1rAT6qj3dn2lqnUrJaHaMW0ip3ChdzyW5LR-sRefeAtNW4LJyhyXDCB61t9QTEPU81mC9t0umz5yl73s-QNWJpa56OjLPEOSUeK2AYQhuP9-HMXI85vrnqcK2g1qBCwbWd78yxO5iCGuRTqVmIHn-A1RxkrWt01-eIdcmLEy-thua9uVVqRVfnIqmtRqtWiKO3fCnWt0y8jouokZYfwoZ30rfO4KDN4Gbor3UclNMGUsGcuX8ZyxF-N3TzZNUFLRhw5IKF6-KE_x46mQ8IJa2nfuQFKq6duwN9ndpAdcF8wN5cpNtj7ZTc7kP4-dEQW15ytTe8DDXhaR3wED4NprhjimFd-7btRobwEJWdmLaWCaQDCo9H2EkivwLmBHntm1vM3MCnqmnpkB0j8n0GuNiPbZS0m49jOIj3GYgfdrtsOLdOMe05i_bvRZOxCQ5a1Dfyxv3icqIA5R0pd7ZGNBAAOiFRTWcGhuTPW4PA_9TKDn9-wP0zz9yt9_J3pqeHKlP729M7sijfW9jRE75wiUJ_RKpaTPrOKUdyDNFD7-52tE9a9zZiJ_9bp-SfW2RoJ36fZItS_0B0lZlDhGA2x02nXl1VyijOOphuFzSk5CY9dEBqw1RRBWdd45gmV4lxrtHc-Wv5ZFKlHxfoVSO2U9hIYXkA8vD_pj841sKOPVXo4DQM9ExJOzU4e6ye-HdZR-ey17ghLAQdBMEQEM6Qq3-NhtgvoF7CjuMhysS5_eFft0208pq-2GchCOKV6g5tJWy5FZwcokQHsq5-D6OUX9v-hjoCkBzguGB7Mke_TnA0VV82hIdcXQevk680Gw7gNv0b289AsDKM2fSoCIkgS6WFv3lWPlkUxjgFW0-ltw1p66CrEffmQV=w2879-h1639",
  //   price: 900,
  //   stock: 150,
  //   limit: 0,
  // },
  {
    id: 3,
    name: "エンレイ大豆味噌",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    unit: "900g",
    imageUrl: "https://lh3.googleusercontent.com/fife/AAbDypAMR7M5iIPJoXxKX9YVlSZqa7YqG_pLUwnPB2pusHTR3H11ZNQr8OYBeKhXqCXirdVjPe_gnQ5ZMMXyRbzoufAHDKFsGCkWQcH2UZcIItEWmGuBFpRb4lG8HMQd0CnjuM1ydYokxqgUMRFr7rdtkLLcYzPbRewkTmfuf21hEln4yotN0BdK2bdNt-DjlFjcrcfBxbRI6TRdfcsY5DfqVLXLN9dZ_tH6dU3XlN6Ax3hE5AfI8jeB0RS9-tccYM_oh8baUw2ITad8YPByiss9XT3V1n6bMT8RyV5PRdxMaZVp1EmU-WnBtYvOEne3Hv5Iveu4FnQET1TEdljwzy-FXwFSD0fPrNOgAceDZt4C_3QrUqcbSiX_pwCPwO1Od24hMJupTZ2KcgaSqEjiX3uert4S4_EpPcR-1KWq9y7viSK9sCIwm6bq4wygdB_nu7n-JDBnau-mKl4PzDR1g2pSGJNrDK1xODe6QOxHBe_wLb9kNfKe7o76uN8xL8ufnX6DC1VJ_lnDAhxdLxboLfSC2aV-IZWuMpH26-ATsksQu2LvhZi9Y709ESX5z0vcAj5CZNIddx6o7gSEihJEVs8UsUwi0YQjWsa1mnIXIAR7Y3N6XXKUnQmkwrv1Pa_QLAvPzGCO7zTA7QrNASBXOZDHWbDKZB10EgmmmRuRFEn0pX3GmRZgcchhvoa6i034VRHu5dP2HFQqoTea33vKInj0cVTgOnjPL0H5exypS9pVOvtM0dV2NJpMAgKbsUnTULAytqgDFVQoU6NjK-safZ4NqDk-6GN8CtBSKVUb6KZfHe2TBfKpsFld8N5fIdRNM74Ti3-ynW6zCmUwQi9y_fouiMZ3pOw3PRrNIftgV7_z7E1diYov-Ta2m6q2P47FCh79vddDH5qTXwIqMiuD9SwsDqqvvYs1yNTcl7ikKbxjPhDnaCzxfwdiGt2jxoCvc44bRB4Tz0jG27hzbCZBoLZ41zHrIddkNPdj4DkMl-hoJaFeMgw8EKLigNFF6gxmMiNE-pdmlx-pzBm_Pm9T2idIx5R7WARjvE1oZilBRp0cdCr-lFFG_W_PRwZb0ZWPqTMOst4DmDK_1bKeQdMfVd-ZTgqlHowdmYfki24wlpNUzaB2RwwQBUlMJAjlP3-z7CazWLu5FwxLDu-UGop-hexMDTGnV0Y84exeU4lXDkQqqbYI85s0btzUrka2flNvtFSUBiUd4y4OXWGZr7eJHZFFaXimDpXDc_h5bD3UUhghSxNf_lT7cs8mW9bMUUDFKT8g3rQSoaQE0AcKhWFe6KIRh7ltM4WZePKnP2L7riHWBLFULObzBFMyrOJ2O1bgaEY8V5JSx-CZDxEDUiJ7JCWM6J8C0tQIk_78H2jV_xctT6nLWeKAqUQ4GkRZmomJNT_fU--EHCAQxiC2mdWuFEOKWfW7vAzTLvwSNmx_0JWXIXQ6ZZElWdZpvw7xxGpzV8qPG8KXzsrG9Iy2=w2879-h1639",
    price: 500,
    stock: 10,
    limit: 5,
    days: ["11/13 10:00~12:00", "11/13 12:00~14:00", "11/13 14:00~16:00"],
  },
  {
    id: 4,
    name: "乳酸菌飲料",
    description: "毎年大人気のみそにゅーですが、今年は事前予約制の限定販売です。農工大産のこだわりの逸品をどうぞ！",
    unit: "500ml",
    imageUrl: "https://lh3.googleusercontent.com/fife/AAbDypAMR7M5iIPJoXxKX9YVlSZqa7YqG_pLUwnPB2pusHTR3H11ZNQr8OYBeKhXqCXirdVjPe_gnQ5ZMMXyRbzoufAHDKFsGCkWQcH2UZcIItEWmGuBFpRb4lG8HMQd0CnjuM1ydYokxqgUMRFr7rdtkLLcYzPbRewkTmfuf21hEln4yotN0BdK2bdNt-DjlFjcrcfBxbRI6TRdfcsY5DfqVLXLN9dZ_tH6dU3XlN6Ax3hE5AfI8jeB0RS9-tccYM_oh8baUw2ITad8YPByiss9XT3V1n6bMT8RyV5PRdxMaZVp1EmU-WnBtYvOEne3Hv5Iveu4FnQET1TEdljwzy-FXwFSD0fPrNOgAceDZt4C_3QrUqcbSiX_pwCPwO1Od24hMJupTZ2KcgaSqEjiX3uert4S4_EpPcR-1KWq9y7viSK9sCIwm6bq4wygdB_nu7n-JDBnau-mKl4PzDR1g2pSGJNrDK1xODe6QOxHBe_wLb9kNfKe7o76uN8xL8ufnX6DC1VJ_lnDAhxdLxboLfSC2aV-IZWuMpH26-ATsksQu2LvhZi9Y709ESX5z0vcAj5CZNIddx6o7gSEihJEVs8UsUwi0YQjWsa1mnIXIAR7Y3N6XXKUnQmkwrv1Pa_QLAvPzGCO7zTA7QrNASBXOZDHWbDKZB10EgmmmRuRFEn0pX3GmRZgcchhvoa6i034VRHu5dP2HFQqoTea33vKInj0cVTgOnjPL0H5exypS9pVOvtM0dV2NJpMAgKbsUnTULAytqgDFVQoU6NjK-safZ4NqDk-6GN8CtBSKVUb6KZfHe2TBfKpsFld8N5fIdRNM74Ti3-ynW6zCmUwQi9y_fouiMZ3pOw3PRrNIftgV7_z7E1diYov-Ta2m6q2P47FCh79vddDH5qTXwIqMiuD9SwsDqqvvYs1yNTcl7ikKbxjPhDnaCzxfwdiGt2jxoCvc44bRB4Tz0jG27hzbCZBoLZ41zHrIddkNPdj4DkMl-hoJaFeMgw8EKLigNFF6gxmMiNE-pdmlx-pzBm_Pm9T2idIx5R7WARjvE1oZilBRp0cdCr-lFFG_W_PRwZb0ZWPqTMOst4DmDK_1bKeQdMfVd-ZTgqlHowdmYfki24wlpNUzaB2RwwQBUlMJAjlP3-z7CazWLu5FwxLDu-UGop-hexMDTGnV0Y84exeU4lXDkQqqbYI85s0btzUrka2flNvtFSUBiUd4y4OXWGZr7eJHZFFaXimDpXDc_h5bD3UUhghSxNf_lT7cs8mW9bMUUDFKT8g3rQSoaQE0AcKhWFe6KIRh7ltM4WZePKnP2L7riHWBLFULObzBFMyrOJ2O1bgaEY8V5JSx-CZDxEDUiJ7JCWM6J8C0tQIk_78H2jV_xctT6nLWeKAqUQ4GkRZmomJNT_fU--EHCAQxiC2mdWuFEOKWfW7vAzTLvwSNmx_0JWXIXQ6ZZElWdZpvw7xxGpzV8qPG8KXzsrG9Iy2=w2879-h1639",
    price: 500,
    stock: 10,
    limit: 5,
    days: ["11/13 10:00~12:00", "11/13 12:00~14:00", "11/13 14:00~16:00"],
  },
]

const Shopping = ({ shoppingData }: Props) => {
  const [isEditing, setIsEditing] = useState(false);
  const openForm = () => setIsEditing(true);
  const closeForm = () => setIsEditing(false);
  return (
    <>
      {!shoppingData.reserved || isEditing ? (
        <ShoppingForm
          data={shoppingData}
          products={products}
          beerProducts={beerProducts}
          closeForm={closeForm}
        />
      ) : (
        <>ここにShoppingViewがきます</>
      )}
    </>
  )
}

export default Wrapper