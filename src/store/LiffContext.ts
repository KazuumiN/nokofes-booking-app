import { createContext } from "react";
import type { Liff } from "@line/liff";

const LiffContext = createContext({} as Liff | null);

export default LiffContext;
