import { useState } from "react";

// ✅ Import avatars
import avatar1 from "./assets/avatars/avatar1.jpeg";
import avatar2 from "./assets/avatars/avatar2.jpeg";
import avatar3 from "./assets/avatars/avatar3.jpeg";
import avatar4 from "./assets/avatars/avatar4.jpeg";
import avatar5 from "./assets/avatars/avatar5.jpeg";
import avatar6 from "./assets/avatars/avatar6.jpeg";
import avatar7 from "./assets/avatars/avatar7.jpeg";
import avatar8 from "./assets/avatars/avatar8.jpeg";
import avatar9 from "./assets/avatars/avatar9.jpeg";

// ✅ Arrays of avatars and usernames
const avatarsOriginal = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6, avatar7, avatar8, avatar9];
const namesOriginal = [
  "Anandh", "Jones", "Mahaprabhu", "Dhusanth", "Eren yeagar",
  "Indrajith", "Osama", "karthick Amish", 
  "Arul chandru", "Iskah ahamed", "Madhan", "Arul murugan", "Jegadish"
];

// ✅ Mood array
const moods = [
  { name: "Happy", emoji: "😄", color: "#facc15" }, // yellow
  { name: "Sad", emoji: "😢", color: "#60a5fa" }, // blue
  { name: "Angry", emoji: "😡", color: "#f87171" }, // red
  { name: "Love", emoji: "❤️", color: "#f472b6" }, // pink
  { name: "Chill", emoji: "😎", color: "#34d399" }, // green
];

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState(null);
  const [selectedMood, setSelectedMood] = useState(moods[0]);
  const [availableAvatars, setAvailableAvatars] = useState([...avatarsOriginal]);
  const [availableNames, setAvailableNames] = useState([...namesOriginal]);
  const [pageBg, setPageBg] = useState("#000000"); // default black

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const pickRandomUnique = (array, setArray) => {
    if (array.length === 0) array = array === availableAvatars ? [...avatarsOriginal] : [...namesOriginal];
    const index = Math.floor(Math.random() * array.length);
    const item = array[index];
    const newArray = array.filter((_, i) => i !== index);
    setArray(newArray);
    return item;
  };

  const addPost = () => {
    if (newPost.trim() === "" && !image) return;

    const username = pickRandomUnique(availableNames, setAvailableNames);
    const avatar = pickRandomUnique(availableAvatars, setAvailableAvatars);

    const post = {
      id: Date.now(),
      text: newPost,
      image,
      likes: 0,
      timestamp: new Date(),
      comments: [],
      username,
      avatar,
      mood: selectedMood,
    };

    setPosts([post, ...posts]);
    setNewPost("");
    setImage(null);
    setPageBg(selectedMood.color);
  };

  const likePost = (id) => setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  const deletePost = (id) => setPosts(posts.filter(post => post.id !== id));

  const addComment = (postId, text, mood) => {
    if (!text.trim()) return;

    const username = pickRandomUnique(availableNames, setAvailableNames);
    const avatar = pickRandomUnique(availableAvatars, setAvailableAvatars);

    setPosts(posts.map(post => post.id === postId
      ? {
          ...post,
          comments: [
            ...post.comments,
            { id: Date.now(), text, timestamp: new Date(), username, avatar, mood }
          ]
        }
      : post
    ));
  };

  const formatTime = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 60000);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hr ago`;
    return `${Math.floor(diff / 1440)} d ago`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 transition-colors duration-700" style={{ backgroundColor: pageBg }}>
      <h1 className="text-3xl font-bold mb-6 text-white">📸 Minigram</h1>

      {/* Create Post Box */}
      <div className="w-full max-w-md bg-gray-900/80 p-5 rounded-2xl shadow-md mb-6">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border border-gray-700 bg-gray-800 text-white rounded-lg p-3 mb-3 focus:ring-2 focus:ring-blue-400"
          rows="3"
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-3 w-full text-sm text-gray-400"/>
        {image && <img src={image} alt="Preview" className="w-full h-64 object-cover rounded-lg mb-3"/>}

        {/* Mood Selector */}
        <div className="flex space-x-2 mb-3">
          {moods.map((mood) => (
            <button key={mood.name} onClick={() => setSelectedMood(mood)}
              className={`px-3 py-1 rounded-full border ${selectedMood.name===mood.name ? "border-white text-white" : "border-gray-600 text-gray-300"}`}>
              {mood.emoji} {mood.name}
            </button>
          ))}
        </div>

        <button onClick={addPost} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition">
          Post
        </button>
      </div>

      {/* Posts Feed */}
      <div className="w-full max-w-md space-y-5">
        {posts.length === 0 ? <p className="text-gray-400 text-center">No posts yet!</p> :
          posts.map((post) => (
            <div key={post.id} className="p-4 rounded-2xl shadow-md"
                 style={{ background: `linear-gradient(135deg, ${post.mood.color}/40, #1f2937)` }}>
              {/* Header */}
              <div className="flex items-center mb-3">
                <img src={post.avatar} alt="avatar" className="w-10 h-10 rounded-full mr-3"/>
                <div>
                  <h2 className="font-semibold text-white">{post.mood.emoji} {post.username}</h2>
                  <p className="text-xs text-gray-400">{formatTime(post.timestamp)}</p>
                </div>
              </div>

              {/* Post Content */}
              {post.text && <p className="mb-3 text-gray-200 text-base">{post.text}</p>}
              {post.image && <img src={post.image} alt="Post" className="w-full h-72 object-cover rounded-lg mb-3"/>}

              {/* Buttons */}
              <div className="flex justify-between items-center mb-3">
                <button onClick={() => likePost(post.id)} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">👍 {post.likes} Likes</button>
                <button onClick={() => deletePost(post.id)} className="text-sm bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">🗑 Delete</button>
              </div>

              {/* Comments */}
              <div className="mt-2">
                <h3 className="font-semibold text-gray-300 text-sm mb-2">Comments</h3>
                <div className="space-y-2 mb-2">
                  {post.comments.map((c) => (
                    <div key={c.id} className="flex items-start space-x-2">
                      <img src={c.avatar} alt="comment-avatar" className="w-8 h-8 rounded-full"/>
                      <div className="p-2 rounded-lg" style={{ background: `linear-gradient(135deg, ${c.mood.color}/30, #1f2937)` }}>
                        <p className="text-sm text-white font-semibold">{c.mood.emoji} {c.username}</p>
                        <p className="text-sm text-white">{c.text}</p>
                        <p className="text-xs text-gray-400">{formatTime(c.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <CommentBox postId={post.id} addComment={addComment}/>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// Comment input box with mood selection
function CommentBox({ postId, addComment }) {
  const [text, setText] = useState("");
  const [selectedMood, setSelectedMood] = useState(moods[0]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    addComment(postId, text, selectedMood);
    setText("");
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex space-x-2">
        {moods.map((mood) => (
          <button key={mood.name} onClick={() => setSelectedMood(mood)}
            className={`px-2 py-1 rounded-full border ${selectedMood.name===mood.name ? "border-white text-white" : "border-gray-600 text-gray-300"}`}>
            {mood.emoji}
          </button>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Add a comment..."
          className="flex-1 border border-gray-700 bg-gray-800 text-white rounded-full px-3 py-1 text-sm"/>
        <button onClick={handleSubmit} className="text-sm bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700">Post</button>
      </div>
    </div>
  );
}

export default App;
