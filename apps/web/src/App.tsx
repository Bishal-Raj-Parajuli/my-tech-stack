import { useState } from "react";

function App() {
  // Sample posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Getting Started with React",
      body: "React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage state efficiently. This post will guide you through the basics of React development.",
      category: "Development",
      date: "Apr 15, 2025",
    },
    {
      id: 2,
      title: "Tailwind CSS Fundamentals",
      body: "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.",
      category: "Design",
      date: "Apr 12, 2025",
    },
    {
      id: 3,
      title: "JavaScript ES6 Features",
      body: "ES6 introduced many new features to JavaScript including arrow functions, template literals, destructuring, spread operators, and more. These features make your code more readable and maintainable.",
      category: "Development",
      date: "Apr 10, 2025",
    },
    {
      id: 4,
      title: "Building Responsive Layouts",
      body: "Creating responsive layouts ensures your application looks great on all devices. Learn how to use media queries, flexbox, and grid to create layouts that adapt to different screen sizes.",
      category: "Design",
      date: "Apr 8, 2025",
    },
    {
      id: 5,
      title: "State Management in React",
      body: "Managing state is crucial in React applications. From useState for component-level state to more complex solutions like Context API or Redux for global state, choosing the right approach is important for your app's performance and maintainability.",
      category: "Development",
      date: "Apr 5, 2025",
    },
  ]);

  // Function to add a new post
  const addPost = () => {
    const newPost = {
      id: posts.length + 1,
      title: `New Post ${posts.length + 1}`,
      body: "This is a newly added post. Click the edit button to change its content.",
      category: "General",
      date: "Apr 19, 2025",
    };
    setPosts([...posts, newPost]);
  };

  // State for tracking which post is being edited
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCategory, setEditCategory] = useState("");

  // Filter state
  const [filter, setFilter] = useState("All");

  // Categories for filtering
  const categories = ["All", ...new Set(posts.map((post) => post.category))];

  // Filtered posts
  const filteredPosts =
    filter === "All" ? posts : posts.filter((post) => post.category === filter);

  // Start editing a post
  const startEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditCategory(post.category);
  };

  // Save edited post
  const saveEdit = () => {
    setPosts(
      posts.map((post) =>
        post.id === editingId
          ? {
              ...post,
              title: editTitle,
              body: editBody,
              category: editCategory,
            }
          : post
      )
    );
    setEditingId(null);
  };

  // Delete a post
  const deletePost = (id) => {
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
              Posts
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              View and manage your collection of articles
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <div className="relative">
              <select
                className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={addPost}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Post
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
            >
              {editingId === post.id ? (
                <div className="p-6 flex-grow">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {post.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                      {post.body}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-between items-center">
                    <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Read more
                    </button>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
