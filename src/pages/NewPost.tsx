import { useState, useRef } from 'react';
import { collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';

export function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const postRef = await addDoc(collection(db, 'posts'), {
        title,
        content,
        author: user?.email,
        createdAt: serverTimestamp()
      });

      if (file) {
        const fileRef = ref(storage, `posts/${postRef.id}/${file.name}`);
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);

        // Update the post with the file URL
        await updateDoc(postRef, { mediaUrl: fileURL, mediaType: file.type });
      }

      navigate('/');
    } catch (error: any) {
      console.error("Error creating post:", error);
      setError('Failed to create post');
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-3xl drop-shadow-2xl font-bold text-gray-800 mb-6">Create New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500">{error}</div>}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image/Video
          </label>
          <div
            onClick={handleFileUploadClick}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors group relative"
          >
            <input
              ref={fileInputRef}
              type="file"
              id="file"
              accept="image/*,video/*"
              onChange={(e) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <Upload className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              {file ? (
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-600">{file.name}</p>
                  {file.type.startsWith('image/') && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 ">Upload an image or video</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-gray-800 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
}
