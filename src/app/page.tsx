import { Typography } from "@mui/material";
import Post from "./components/Post";
import PostsListing from "./modules/PostsListing";

export default function Home() {
  return (
    <div className="container-lg">
      <div className="row justify-content-center">
        <PostsListing />
      </div>
    </div>
  )
}