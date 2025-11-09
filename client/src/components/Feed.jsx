import React, { useState, useEffect } from "react";
import Post from "./Post";
import { useDispatch, useSelector } from "react-redux";
import { setPostSlice } from "@/redux/postSlice";



const Feed = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  // console.log(posts)
  return (
    <div className="flex flex-col gap-6">
      {posts
        ?.filter(post => post !== null) // remove nulls
        .map(post => (
          <Post key={post._id} post={post} />
        ))}

    </div>
  );
};

export default Feed;
