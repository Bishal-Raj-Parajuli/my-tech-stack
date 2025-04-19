import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { APIRoute } from "@mytechstack/ts-rest";

export const tsr = initTsrReactQuery(APIRoute, {
  baseUrl: "http://localhost:3000",
  baseHeaders: {
    "Content-Type": "application/json",
  },
});
