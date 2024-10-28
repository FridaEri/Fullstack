import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [editId, setEditId] = useState(null);
    const [searchTitle, setSearchTitle] = useState('');

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/posts');
            setPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const addPost = async () => {
        try {
            await axios.post('http://localhost:3000/api/posts', { title, content, category_id: categoryId });
            fetchPosts();
            setTitle('');
            setContent('');
            setCategoryId('');
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const updatePost = async (id) => {
        try {
            await axios.put(`http://localhost:3000/api/posts/${id}`, { title, content, category_id: categoryId });
            fetchPosts();
            setEditId(null);
            setTitle('');
            setContent('');
            setCategoryId('');
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const deletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/posts/${id}`);
            fetchPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEdit = (post) => {
        setEditId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setCategoryId(post.category_id);
    };

    const handleSearch = () => {
        fetchPostsByTitle(searchTitle);
    };

    const fetchPostsByTitle = async (title) => {
        try {
            const response = await axios.get(`http://localhost:3000/api/posts/title/${title}`);
            setPosts(response.data);
        } catch (error) {
            console.error('Error searching posts:', error);
        }
    };

    return (
        <div>
            <h1>Blog Posts</h1>
            <input 
                value={searchTitle} 
                onChange={(e) => setSearchTitle(e.target.value)} 
                placeholder="Search by Title" 
            />
            <button onClick={handleSearch}>Search</button>
            <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Post Title" 
            />
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                placeholder="Post Content" 
            />
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">Select category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            {editId ? (
                <button onClick={() => updatePost(editId)}>Update Post</button>
            ) : (
                <button onClick={addPost}>Add Post</button>
            )}
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <p><strong>Category:</strong> {post.category_name}</p>
                        <button onClick={() => handleEdit(post)}>Edit</button>
                        <button onClick={() => deletePost(post.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
