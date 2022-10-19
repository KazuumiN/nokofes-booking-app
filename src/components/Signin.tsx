// Next authでemailサインインするためのフォーム

import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const regexp = /^[a-zA-Z0-9_+-]+(\.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
  
  const handleSubmit = async () => {
    setIsSigningIn(true);
    await signIn("email", { email });
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  
  return (
    <div className="flex flex-col w-full px-2">
      ログインが必要です。
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <div className="mt-1">
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          className="w-5/6 rounded-sm border-b-2 px-1"
          required
          autoFocus
          value={email}
          placeholder="s200671u@st.go.tuat.ac.jp"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" id="email-description">
        農工大生の方は、~@st.go.tuat.ac.jpのメールアドレスを入力してください。
      </p>
      <button
        type="button"
        className="flex justify-center items-center space-x-4 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-500"
        onClick={handleSubmit}
        disabled={!regexp.test(email)||isSigningIn}
      >ログインする <Spinner shown={isSigningIn} /></button>
    </div>
  );
}

const Spinner = ({shown}: {shown: boolean}) => (
  <div className={shown ? "flex justify-center" : "opacity-0 flex justify-center"}>
    <div className="animate-spin h-6 w-6 border-4 border-green-500 rounded-full border-t-transparent"></div>
  </div>
)

export default SignIn;
