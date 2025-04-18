import { initContract } from "@ts-rest/core";
import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  SUCCESS,
} from "../utils/response";
import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1, "Title is required"),
  body: z.string().trim().min(1, "Body is required"),
});

export const postContract = initContract().router({
  createPost: {
    method: "POST",
    path: "/posts",
    responses: {
      201: CREATED(PostSchema),
      400: BAD_REQUEST,
      500: INTERNAL_SERVER_ERROR,
    },
    body: PostSchema.omit({
      id: true,
    }),
    strictStatusCodes: true,
    summary: "Create a post",
  },
  getPost: {
    method: "GET",
    path: `/posts/:id`,
    pathParams: z.object({
      id: z.coerce.number(),
    }),
    responses: {
      200: SUCCESS(PostSchema),
      404: NOT_FOUND,
      500: INTERNAL_SERVER_ERROR,
    },
    strictStatusCodes: true,
    summary: "Get a post by id",
  },
  getPosts: {
    method: "GET",
    path: `/posts`,
    responses: {
      200: SUCCESS(z.array(PostSchema)),
      500: INTERNAL_SERVER_ERROR,
    },
    strictStatusCodes: true,
    summary: "Get all posts",
  },
});
