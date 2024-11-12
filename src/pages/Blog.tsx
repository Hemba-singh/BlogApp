import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  mediaUrl?: string;
  mediaType?: string;
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { isAdmin, logout } = useAuth();
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() ?? new Date(),
      }) as BlogPost);
      setPosts(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchPosts();
}, []);

  if (loading) {
    return <div className='text-center'>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Manitombi</h1>
        <div className="space-x-4">
          {isAdmin() && (
            <Link
              to="/new-post"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              New Post
            </Link>
          )}
          <button
            onClick={logout}
            className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-gray-700 bg-blue-300 hover:bg-blue-500"
          >
            Logout
          </button>
        </div> 
      </div>

      <div className="mt-6 space-y-6">
         {posts.map((post) => (
          <div key={post.id} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
            {post.mediaUrl && post.mediaType && (
              <div className="mt-4">
                {post.mediaType.startsWith('image/') ? (
                   <img src={post.mediaUrl} alt={post.title} className="w-full h-auto rounded" />
                ) : (
                  <video controls className="w-full h-auto rounded">
                    <source src={post.mediaUrl} type={post.mediaType} />
                      Your browser does not support the video tag.
                  </video>
                )}
              </div>
         )}
        <p className="mt-2 text-gray-600">{post.content}</p>
        <p className="mt-4 text-sm text-gray-500">Posted by admin</p>
      </div>
     ))}
   </div>
 </div>
  );
}
