// @ts-nocheck
import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";
import Home from "./oldHome"
import Entrance from "./oldEntrance";
import Shopping from "./oldShopping";
import { pageType, userType, entranceProps, shoppingProps } from "types";

const dataPattern1 = {
  id: "12345678",
  entrance: {
    reserved: true,
    dates: [11, 13],
    accompaniers: 2,
  },
  shopping: {
    reserved: true,
    whenToBuy: "11-12_am",
    items: [
      {
        id: 1,
        amount: 5,
      },
      {
        id: 3,
        amount: 2,
      },
    ],
  },
}

const dataPattern2 = {
  id: "19283746",
  entrance: {
    reserved: false,
    dates: [],
    accompaniers: 0,
  },
  shopping: {
    reserved: false,
    whenToBuy: "",
    items: [],
  },
}


function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [entranceData, setEntranceData] = useState<entranceProps>({
    reserved: false,
    dates: [],
    accompaniers: 0,
  });
  const [shoppingData, setShoppingData] = useState<shoppingProps>({
    reserved: false,
    whenToBuy: "",
    items: [],
  });
  const [currentPage, setCurrentPage] = useState<pageType>('home');
  const [currentUserType, setCurrentUserType] = useState<userType>('');

  const setUserData = async (token: string, currentUserType: userType) => {
    // const res = await fetch(`${import.meta.env.VITE_API_URL}/qr/${id}`);
    // const data = await res.json();
    // setQrId(data.qr_id);
    setId(dataPattern1.id);
    setEntranceData(dataPattern1.entrance);
    setShoppingData(dataPattern2.shopping);
  }

  const moveTo = (page: pageType) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    if (!currentUserType) {
      liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        if (liff.isInClient()) {
          setToken(liff.getAccessToken() || '')
          setCurrentUserType('general')
        } else {
          // Googleでログインするためのモーダル出すなど。
          setToken('thisistest') // TODO: aa
          setCurrentUserType('nokodaisei')
        }
      })
      .catch((e: Error) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
    }
  });

  useEffect(() => {
    if (!id && token && currentUserType) {
      setUserData(token, currentUserType);
    }
  }, [token, currentUserType]);

  return (
    <div className="flex flex-col items-center max-w-sm mx-auto my-4 text-gray-900 sm:text-gray-700">
      {currentPage === 'home' && (
        <Home
          id={id}
          entranceReserved={entranceData.reserved}
          shoppingReserved={shoppingData.reserved}
          moveTo={moveTo}
        />
      )}
      {currentPage === 'entrance' && (
        <Entrance
          id={id}
          entranceData={entranceData}
          returnToHome={() => moveTo('home')}
        />
      )}
      {currentPage === 'shopping' && (
        <Shopping
          id={id}
          shoppingData={shoppingData}
          returnToHome={() => moveTo('home')}
        />
      )}
    </div>
  );
}

export default App;

