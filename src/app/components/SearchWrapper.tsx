'use client';

import { useSearchParams } from 'next/navigation';
import PostsListing from '../modules/PostsListing';
import React from 'react';

export default function SearchWrapper() {
  const searchParams = useSearchParams();
  const topPost = searchParams.get("topPost");

  return <PostsListing topPost={topPost} />;
}
