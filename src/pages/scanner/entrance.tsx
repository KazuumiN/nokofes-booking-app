// @ts-nocheck
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import dynamic from 'next/dynamic'

// const {QrReader} = dynamic(() => import('react-qr-reader'), {
    // ssr: false,
// })

const Test = (props) => {
  const [data, setData] = useState('No result');

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            console.log(result?.text);
          }
          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );
};


export default Test