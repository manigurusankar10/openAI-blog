import React, { useCallback, useReducer, useState } from "react";

const PostsContext = React.createContext({});

export default PostsContext;

function postsReducer(state, action) {
  switch(action.type) {
    case 'addPosts': {
      const newPosts = [...state];
      //make sure the post is not already in the array
      action.posts.forEach(post => {
        const exists = newPosts.find(p => p._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case 'deletePost': {
      const newPosts = [];
      state.forEach(post => {
        if(post._id !== action.postId) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    default:
      return state;
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const deletePost = useCallback((postId) => {
    dispatch({
      type: 'deletePost',
      postId
    });
  }, []);
  //initial set of posts from the server side to display on page load
  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    //check if its the last set of posts
    if (postsFromSSR.length < 5) {
      setNoMorePosts(true);
    }
    dispatch({
      type: 'addPosts',
      posts: postsFromSSR
    });
  }, []);

  //api call to fetch next 5 posts
  const getPosts = useCallback(async ({lastPostDate, getNewerPosts = false}) => {
    const result = await fetch('/api/getPosts', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({lastPostDate, getNewerPosts})
    });

    const json = await result.json();
    const postsResult = json.posts || [];
    console.log(postsResult);
    //check if its the last set of posts
    if (postsResult.length < 5) {
      setNoMorePosts(true);
    }
    dispatch({
      type: 'addPosts',
      posts: postsResult
    });
  }, []);
  return (
    <PostsContext.Provider value={{
      posts, setPostsFromSSR, getPosts, noMorePosts, deletePost}}>
      {children}
    </PostsContext.Provider>
  );
}