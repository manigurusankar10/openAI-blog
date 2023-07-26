import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ObjectId } from "mongodb";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import PostsContext from "../../context/postsContext";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deletePost } = useContext(PostsContext);

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/deletePost', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ postId: props.id})
      });
      const json = await response.json();
      if (json.success) {
        deletePost(props.id);
        router.replace('/post/new');
      }
    } catch (error) {
      console.log('error deleteing post when clicked button', error);
    }
  };

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords:
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keyword.split(",").map((k, i) => (
            <div key={i} className="p-2 rounded-full bg-slate-800 text-white">
              <FontAwesomeIcon icon={faHashtag} /> {k}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog post
        </div>
        <div dangerouslySetInnerHTML={{__html: props.postContent || ""}} />
        <div className="my-4">
          {!showDeleteConfirm && (
            <button 
              className="btn bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(true)}>
              Delete post
            </button>
          )}
          {showDeleteConfirm && (
            <div>
              <p className="p-2 bg-red-300 text-center">
                Are you sure you want to delete this post? This action is irreversible.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="btn bg-stone-600 hover:bg-stone-700"
                  onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </button>
                <button 
                  className="btn bg-red-600 hover:bg-red-700"
                  onClick={handleDeleteConfirm}>
                  Confirm delete
              </button>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub
    });
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false
        }
      }
    }

    return {
      props: {
        id: ctx.params.postId,
        postContent: post?.postContent,
        title: post?.title,
        metaDescription: post?.metaDescription,
        keyword: post?.keyword,
        postCreated: post?.created.toString(),
        ...props
      }
    }
  }
});