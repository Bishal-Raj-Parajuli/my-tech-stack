import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';
import { APIRoute } from '@mytechstack/ts-rest';
import { PostService } from 'src/services/post.services';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @TsRestHandler(APIRoute.posts.getPosts)
  getAllPosts() {
    return tsRestHandler(APIRoute.posts.getPosts, async () => {
      try {
        const posts = await this.postService.getAllPosts();
        return {
          status: HttpStatus.OK,
          body: {
            status: 'OK',
            data: posts,
          },
        };
      } catch (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    });
  }

  @TsRestHandler(APIRoute.posts.getPost)
  getPostById() {
    return tsRestHandler(APIRoute.posts.getPost, async ({ params }) => {
      try {
        const post = await this.postService.getPostById(params.id);
        if (!post) {
          return {
            status: HttpStatus.NOT_FOUND,
            body: { status: 'NOT_FOUND', message: 'Post not found' },
          };
        }
        return { status: 200, body: { status: 'OK', data: post } };
      } catch (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    });
  }

  @TsRestHandler(APIRoute.posts.createPost)
  createPost() {
    return tsRestHandler(APIRoute.posts.createPost, async ({ body }) => {
      try {
        const post = await this.postService.createPost(body);
        //NOTE: CHEK IF POST WAS CREATED
        return {
          status: HttpStatus.CREATED,
          body: {
            status: 'CREATED',
            data: post,
          },
        };
      } catch (error) {
        throw new HttpException('Internal Server Error', 500);
      }
    });
  }
}
