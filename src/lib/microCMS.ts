// MICROCMSを初期化
import { createClient } from 'microcms-js-sdk';

const client = createClient({
  serviceDomain: "nokofes-board",
  apiKey: process.env.MICROCMS_API_KEY_GET_ONLY || '',
});

export default client;