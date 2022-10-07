import type { Liff } from "@line/liff";
import type { NextPage } from "next";
import Head from "next/head";
import Timer from "components/Timer";

const Home: NextPage<{ liff: Liff | null; liffError: string | null }> = ({
  liff,
  liffError
}) => {
  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Timer />
      </main>
    </div>
  );
};

export default Home;
