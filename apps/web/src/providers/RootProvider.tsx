import React from "react";
import { QueryProvider } from "./ReactQueryProvider";

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};
