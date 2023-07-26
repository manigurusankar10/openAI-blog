import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faBrain, faL } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from "react";
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";

export default function NewPost() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/generatePost', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ topic, keyword })
      });
  
      const json = await response.json();
      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
  <div className="h1-full overflow-hidden">
    {loading && (
       <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
       <FontAwesomeIcon icon={faBrain} className="text-8xl"/>
       <h6>Genarting...</h6>
     </div>
    )}
  
    {!loading && (
      <div className="w-full h-full flex flex-col overflow-auto">
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <div>
          <label>
            <strong>
              Generate a blog post on the topic of:
            </strong>
          </label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={e => setTopic(e.target.value)} maxLength={80} />
        </div>
        <div>
        <label>
            <strong>
              Targetting the following keywords:
            </strong>
          </label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keyword} onChange={e => setKeyword(e.target.value)} maxLength={80}/>
          <small className="block mb-2">Separate keywords with a comma</small>
        </div>
        <button type="submit" className="btn" disabled={!topic.trim() || !keyword.trim()}>
          Generate
        </button>
      </form>
    </div>
    )}
  </div>
  );
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false
        }
      }
    }
    return {
      props
    };
  }
});