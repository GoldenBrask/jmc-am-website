import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../config';

export default function TeamManager() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        linkedin: '',
        rank: 0,
        image: '',
        mandateYear: new Date().getFullYear().toString(),
        competences: '',
        experience: '',
        formation: '',
        projets: '' // Comma separated
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const res = await api.get('/team');
            setMembers(res.data);
        } catch (error) {
            toast.error("Erreur lors du chargement de l'équipe");
        } finally {
            setLoading(false);
        }
    };

    // Helper to fix image URL if relative
    const getImageUrl = (url) => {
        if (!url) return "/images/Mini_logo_JMC_AM_blanc.png";
        if (url.startsWith('http') || url.startsWith('data:')) return url;
        if (url.startsWith('/uploads')) return `${BACKEND_URL}${url} `;
        return url;
    };

    const handleEdit = (member) => {
        setCurrentMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            bio: member.bio || '',
            linkedin: member.linkedin || '',
            rank: member.rank || 0,
            image: member.image || '',
            mandateYear: member.mandateYear || new Date().getFullYear().toString(),
            competences: member.competences ? member.competences.join(', ') : '',
            experience: member.experience || '',
            formation: member.formation || '',
            projets: member.projets ? member.projets.join(', ') : ''
        });
        setIsEditing(true);
        setImageFile(null);
    };

    const handleAddNew = () => {
        setCurrentMember(null);
        setFormData({
            name: '',
            role: '',
            bio: '',
            linkedin: '',
            rank: members.length + 1,
            image: '',
            mandateYear: new Date().getFullYear().toString(),
            competences: '',
            experience: '',
            formation: '',
            projets: ''
        });
        setIsEditing(true);
        setImageFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
        try {
            await api.delete(`/team/${id}`);
            setMembers(members.filter(m => m.id !== id));
            toast.success('Membre supprimé');
        } catch (error) {
            toast.error("Erreur lors de la suppression");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.image;

        // Upload image if file selected
        if (imageFile) {
            const uploadData = new FormData();
            uploadData.append('image', imageFile);
            try {
                const uploadRes = await api.post('/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                // Backend usually returns relative path like /uploads/... 
                // We'll store it as is in DB, and frontend will prepend host if needed
                imageUrl = uploadRes.data.url;
            } catch (err) {
                toast.error("Erreur lors de l'upload de l'image");
                return;
            }
        }

        const payload = {
            ...formData,
            image: imageUrl,
            competences: formData.competences.split(',').map(s => s.trim()).filter(Boolean),
            projets: formData.projets.split(',').map(s => s.trim()).filter(Boolean)
        };

        try {
            if (currentMember) {
                const res = await api.put(`/team/${currentMember.id}`, payload);
                setMembers(members.map(m => m.id === currentMember.id ? res.data : m));
                toast.success('Membre mis à jour');
            } else {
                const res = await api.post('/team', payload);
                setMembers([...members, res.data]);
                toast.success('Membre ajouté');
            }
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement");
        }
    };

    if (loading) return <div className="p-8 text-center text-white">Chargement...</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Hall of Fame</h1>
                    <p className="text-slate-400">Gérez les membres de l'équipe JMC</p>
                </div>
                {!isEditing && (
                    <button onClick={handleAddNew} className="btn btn-primary gap-2">
                        <Plus size={20} /> Ajouter un membre
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-white mb-6">
                        {currentMember ? 'Modifier le membre' : 'Nouveau membre'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Nom</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Rôle / Poste</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Formation</label>
                                <input
                                    type="text"
                                    value={formData.formation}
                                    onChange={e => setFormData({ ...formData, formation: e.target.value })}
                                    placeholder="Ex: Master 2 Informatique"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Expérience</label>
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={e => setFormData({ ...formData, experience: e.target.value })}
                                    placeholder="Ex: 2 ans chez..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Projets (séparés par virgule)</label>
                            <input
                                type="text"
                                value={formData.projets}
                                onChange={e => setFormData({ ...formData, projets: e.target.value })}
                                placeholder="Site Web, App Mobile..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Compétences (séparées par une virgule)</label>
                            <input
                                type="text"
                                value={formData.competences}
                                onChange={e => setFormData({ ...formData, competences: e.target.value })}
                                placeholder="React, Node.js, Design..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-400 mb-1">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={formData.linkedin}
                                    onChange={e => setFormData({ ...formData, linkedin: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Mandat (Année)</label>
                                <input
                                    type="text"
                                    value={formData.mandateYear}
                                    onChange={e => setFormData({ ...formData, mandateYear: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Ordre d'affichage</label>
                            <input
                                type="number"
                                value={formData.rank}
                                onChange={e => setFormData({ ...formData, rank: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Photo</label>
                            <div className="flex items-center gap-4">
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-slate-600" />
                                )}
                                <label className="cursor-pointer bg-slate-900 border border-slate-700 hover:border-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                    <Upload size={18} />
                                    Choisir une image
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary gap-2"
                            >
                                <Save size={18} /> Enregistrer
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member) => (
                        <div key={member.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 flex items-start gap-4 hover:border-blue-500/50 transition-colors">
                            <img
                                src={getImageUrl(member.image)}
                                alt={member.name}
                                className="w-16 h-16 rounded-full object-cover bg-slate-900"
                                onError={(e) => { e.target.src = "/images/Mini_logo_JMC_AM_blanc.png" }}
                            />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white truncate">{member.name}</h3>
                                <p className="text-blue-400 text-sm mb-1">{member.role}</p>
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-400 truncate block mt-1">
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <span className="text-xs bg-slate-900 px-2 py-1 rounded text-slate-400 font-mono">
                                    {member.mandateYear || '2025'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
