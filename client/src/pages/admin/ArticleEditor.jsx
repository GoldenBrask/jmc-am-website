import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Save, ArrowLeft, Upload, ImageIcon } from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = React.lazy(() => import('react-quill-new'));

export default function ArticleEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isEditing = !!id;
    const quillRef = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('Tech');
    const [image, setImage] = useState('');
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const fetchArticle = async () => {
                try {
                    const res = await api.get(`/articles/${id}`);
                    const a = res.data;
                    setTitle(a.title);
                    setContent(a.content);
                    setExcerpt(a.excerpt || '');
                    setCategory(a.category);
                    setImage(a.image || '');
                    setPublished(a.published);
                } catch (error) {
                    toast.error('Erreur chargement article');
                }
            };
            fetchArticle();
        }
    }, [id, isEditing]);

    const uploadFileHandler = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            setUploading(true);
            const res = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setUploading(false);
            const SERVER_URL = import.meta.env.VITE_API_URL.replace('/api', '');
            return `${SERVER_URL}${res.data.url}`;
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Erreur upload image');
            return null;
        }
    };

    const handleCoverUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = await uploadFileHandler(file);
            if (url) setImage(url);
        }
    };

    // Custom Image Handler for Quill
    const imageHandler = () => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const url = await uploadFileHandler(file);
                if (url) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, 'image', url);
                }
            }
        };
    };

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: imageHandler
            }
        }
    }), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Construct article object from state
        const articleDataFromState = {
            title,
            excerpt,
            content,
            category,
            image: image, // Using the image URL from state
            published
        };

        try {
            if (isEditing) {
                await api.put(`/articles/${id}`, articleDataFromState);
                toast.success('Article mis à jour !');
            } else {
                await api.post('/articles', articleDataFromState);
                toast.success('Article créé avec succès !');
            }
            navigate('/admin/dashboard');
        } catch (error) {
            console.error(error);
            toast.error('Erreur sauvegarde');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/admin/dashboard')} className="p-2 hover:bg-slate-800 rounded-lg">
                        <ArrowLeft />
                    </button>
                    <h1 className="text-3xl font-bold">{isEditing ? 'Modifier l\'article' : 'Nouvel Article'}</h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400">Titre</label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg text-xl font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Titre de votre article..."
                        />
                    </div>

                    <div className="space-y-2 h-[500px]">
                        <label className="text-sm text-slate-400">Contenu</label>
                        <div className="bg-white text-black rounded-lg overflow-hidden h-full">
                            <React.Suspense fallback={<div className="p-4 text-black">Chargement éditeur...</div>}>
                                <ReactQuill
                                    ref={quillRef}
                                    theme="snow"
                                    value={content}
                                    onChange={setContent}
                                    modules={modules}
                                    className="h-[450px]"
                                />
                            </React.Suspense>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                        <h3 className="font-bold border-b border-slate-700 pb-2">Paramètres</h3>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Catégorie</label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2"
                            >
                                <option>Tech</option>
                                <option>Business</option>
                                <option>Vie Associative</option>
                                <option>Events</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Statut</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={published}
                                    onChange={e => setPublished(e.target.checked)}
                                    className="w-5 h-5 accent-blue-500"
                                />
                                <span>Publié</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
                        <h3 className="font-bold border-b border-slate-700 pb-2">Méta-données</h3>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Extrait (Résumé)</label>
                            <textarea
                                value={excerpt}
                                onChange={e => setExcerpt(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 h-24 text-sm"
                                placeholder="Bref résumé..."
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Image de couverture</label>

                            {/* File Input */}
                            <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-700 transition">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                        <p className="text-sm text-slate-400">
                                            {uploading ? 'Upload en cours...' : 'Cliquez pour uploader'}
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleCoverUpload} accept="image/*" />
                                </label>
                            </div>

                            {/* URL Fallback/Display */}
                            <input
                                type="text"
                                value={image}
                                onChange={e => setImage(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm mt-2"
                                placeholder="Ou coller une URL..."
                            />

                            {image && (
                                <div className="mt-2 relative group">
                                    <img src={image} alt="Cover" className="rounded-lg w-full h-32 object-cover border border-slate-700" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition disabled:opacity-50"
                    >
                        {loading ? 'Sauvegarde...' : <><Save size={20} /> Sauvegarder l'article</>}
                    </button>
                </div>
            </div>
        </div>
    );
}
