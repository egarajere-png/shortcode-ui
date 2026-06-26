import React from 'react';
import './Loading.css';

function Loading({ message }) {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white border border-gray-100 shadow-xl rounded-xl px-8 py-6 flex items-center flex-col gap-4 min-w-[180px]">
        {/* Animated dots */}
        <div className="loader-dots block relative w-20 h-5">
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-600"></div>
          <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-blue-600"></div>
        </div>
        {message && (
          <p className="text-sm font-medium text-gray-500 text-center max-w-[200px] leading-snug">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Loading;