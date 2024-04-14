import { HomeFeed } from "../_components/feed";
import { WritePost } from "../_components/posts/write-post";

const Home = () => {
  return (
    <div>
      <WritePost />
      <HomeFeed />
    </div>
  );
}
 
export default Home;