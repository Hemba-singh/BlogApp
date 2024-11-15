import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NewPost } from './NewPost';
import { AuthContext } from '../contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

describe('NewPost', () => {
  const mockUser = { email: 'test@example.com' };

  const renderNewPost = () => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={{ user: mockUser }}>
          <NewPost />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };
});
