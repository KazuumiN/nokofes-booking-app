// Next authでemailサインインするためのフォーム

import { signIn } from "next-auth/react";
import { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const handleSubmit = async () => {
    setIsSigningIn(true);
    await signIn("email", { email });
  };
  
  return (
    <div className="flex flex-col w-full">
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
          className="w-5/6 rounded-sm border-b-2"
          required
          value={email}
          placeholder="s200671u@st.go.tuat.ac.jp"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" id="email-description">
        農工大生の方は、~@st.go.tuat.ac.jpのメールアドレスを入力してください。
      </p>
      <button
        type="button"
        className="items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-slate-500"
        onClick={handleSubmit}
        disabled={!email||isSigningIn}
      >ログインする</button>
    </div>
  );
}

export default SignIn;
