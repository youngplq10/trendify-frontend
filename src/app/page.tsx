import { Typography } from "@mui/material";
import Post from "./components/PostCard";
import PostsListing from "./modules/PostsListing";
import Navbar from "./modules/Navbar";

export default function Home() {
    return (
      <section className="container-lg">
        <nav className="row">
          <Navbar />
        </nav>
        <section className="row justify-content-center">
          <PostsListing />
        </section>
      </section>
    )
}