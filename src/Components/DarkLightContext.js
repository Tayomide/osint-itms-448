import { createContext } from "react";

export const DarkLightContext = createContext({
  mode: "light",
  setMode: () => {}
})