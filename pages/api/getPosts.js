import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  //get next 5 posts from the last created post
  try {
    const { user: { sub }} = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const userProfile = await db.collection("users").findOne({
      auth0Id: sub
    });

    //last created post currently being displayed
    //if getNewerPosts is true, get all the posts from that date with no limit
    //otherwise get the next 5 oldest one
    const { lastPostDate, getNewerPosts } = req.body;
    
    const posts = await db.collection("posts").find({
      userId: userProfile._id,
      created: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate)}
    })
    .limit(getNewerPosts ? 0 : 5)
    .sort({ created: -1})
    .toArray();

    res.status(200).json({posts});
    return;
  } catch (error) {
    
  }
})