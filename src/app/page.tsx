"use client"

import PostsListing from "./modules/PostsListing";
import Navbar from "./modules/Navbar";
import { useSearchParams } from "next/navigation";

export default function Home() {

  const searchParams = useSearchParams();
      const topPost = searchParams.get("topPost");
      
    return (
      <section className="container-lg">
        <nav className="row">
          <Navbar />
        </nav>
        <section className="row justify-content-center">
          <PostsListing topPost={topPost} />
        </section>
      </section>
    )
}