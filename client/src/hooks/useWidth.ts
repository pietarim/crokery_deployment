import { useContext } from "react";
import { WidthContext } from "../context/WidthContext";

export const useWidth = () => {
  const isMobile = useContext(WidthContext);
  return isMobile;
};