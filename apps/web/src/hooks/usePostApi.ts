import { tsr } from "../api/client";

export const useGetPosts = () => {
  return tsr.posts.getPosts.useQuery({
    queryKey: ["posts"],
  });
};
