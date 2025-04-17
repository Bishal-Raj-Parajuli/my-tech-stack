import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

export const contract = c.router({
  createPost: {
    method: "POST",
    path: "/posts",
    responses: {
      201: PostSchema,
    },
    body: z.object({
      title: z.string(),
      body: z.string(),
    }),
    summary: "Create a post",
  },
  getPost: {
    method: "GET",
    path: `/posts/:id`,
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: PostSchema,
      404: z.object({
        message: z.string(),
      }),
    },
    summary: "Get a post by id",
  },
  getPosts: {
    method: "GET",
    path: `/posts`,
    responses: {
      200: z.array(PostSchema),
    },
    summary: "Get all posts",
  },
});
