import { Controller } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { contract } from '@mytechstack/ts-rest';
import { PostService } from 'src/services/post.services';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @TsRestHandler(contract.getPosts)
  getAllPosts() {
    return tsRestHandler(contract.getPosts, async () => {
      const posts = await this.postService.getAllPosts();
      return { status: 200, body: posts };
    });
  }

  @TsRestHandler(contract.getPost)
  getPostById() {
    return tsRestHandler(contract.getPost, async ({ params }) => {
      const post = await this.postService.getPostById(params.id);
      if (!post) {
        return { status: 404, body: { message: 'Post not found' } };
      }
      return { status: 200, body: post };
    });
  }

  @TsRestHandler(contract.createPost)
  createPost() {
    return tsRestHandler(contract.createPost, async ({ body }) => {
      const post = await this.postService.createPost(body);
      return { status: 201, body: post };
    });
  }
}
