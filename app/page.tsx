'use client';

import React, { useState, useEffect } from 'react';

interface Post {
  id: number;
  title: string;
  body: string;
}

const Home = () => {
  // State for storing posts, liked posts, and current page
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state

  // Fetch posts from API
  const fetchPosts = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts');
    const postsData: Post[] = await res.json();
    setPosts(postsData); // Store the posts in the state
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the component is mounted
  }, []);

  // Toggle like status
  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(id)) {
        newLikedPosts.delete(id);
      } else {
        newLikedPosts.add(id);
      }
      return newLikedPosts;
    });
  };

  // Calculate the posts to display based on the current page
  const postsPerPage = 2;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // Calculate the total number of pages
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Total likes count
  const totalLikes = likedPosts.size;

  // Handle the "Next" button click
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle the "Previous" button click
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex justify-center items-center p-4">
      <div className="bg-white p-6 w-full max-w-3xl rounded-lg shadow-lg">
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-6">Posts</h1>

        {/* Displaying the total likes count */}
        <div className="mb-6 text-center text-lg font-semibold text-blue-500">
          <p>Total de Curtidas: {totalLikes}</p>
        </div>

        <ul className="space-y-6">
          {currentPosts.map((post) => (
            <li key={post.id} className="bg-white border border-gray-300 rounded-lg p-6 shadow-md hover:shadow-xl transform hover:translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-4">{post.body}</p>
              <div className="flex justify-start">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 ${
                    likedPosts.has(post.id)
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {likedPosts.has(post.id) ? 'Descurtir' : 'Curtir'}
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Pagination Buttons and Page Counter */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={prevPage}
            className="px-4 py-2 bg-gray-500 text-white rounded-md disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            Anterior
          </button>

          {/* Page counter */}
          <span className="text-lg font-semibold text-gray-700">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={nextPage}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
