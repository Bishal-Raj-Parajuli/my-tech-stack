import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  private posts = [
    {
      id: 1,
      title: 'First Post',
      body: 'This is the content of the first post.',
    },
    {
      id: 2,
      title: 'Second Post',
      body: 'This is the content of the second post.',
    },
  ];

  getAllPosts() {
    return this.posts;
  }

  getPostById(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex !== -1) {
      return this.posts[postIndex];
    }
    return null;
  }
  createPost(post: { title: string; body: string }) {
    const newPost = {
      id: this.posts.length + 1,
      ...post,
    };
    this.posts.push(newPost);
    return newPost;
  }
}
