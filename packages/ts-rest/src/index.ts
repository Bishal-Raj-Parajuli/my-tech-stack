import { initContract } from "@ts-rest/core";
import { postContract } from "./routes/post.router";

export const APIRoute = initContract().router(
  {
    posts: postContract,
  },
  {
    pathPrefix: "/api/v1",
  }
);
