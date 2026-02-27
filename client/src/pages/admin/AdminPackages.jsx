import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Edit2, Trash2, CheckCircle, XCircle, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        duration: '',
        minAmount: '',
        maxAmount: '',
        dailyRate: '',
        vipLevel: 0,
        isActive: true,
        image: '',
        bg: 'bg-blue-500/10',
        color: 'from-blue-500 to-cyan-400'
    });

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/admin/packages', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPackages(res.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const url = editingPackage
                ? `/api/admin/packages/${editingPackage._id}`
                : '/api/admin/packages';

            const method = editingPackage ? 'put' : 'post';

            await axios[method](url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            setEditingPackage(null);
            fetchPackages();
            resetForm();
            toast.success(editingPackage ? 'Package updated' : 'Package created');
        } catch (error) {
            console.error('Error saving package:', error);
            toast.error('Failed to save package');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('image', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/admin/upload-image', formDataUpload, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, image: res.data.url }));
            toast.success('Image uploaded');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Image upload failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this package?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/packages/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPackages();
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const handleEdit = (pkg) => {
        setEditingPackage(pkg);
        setFormData(pkg);
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            duration: '',
            minAmount: '',
            maxAmount: '',
            dailyRate: '',
            vipLevel: 0,
            isActive: true,
            image: '',
            bg: 'bg-blue-500/10',
            color: 'from-blue-500 to-cyan-400'
        });
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Package className="text-blue-500" />
                    Investment Packages
                </h2>
                <button
                    onClick={() => { resetForm(); setEditingPackage(null); setShowModal(true); }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={20} />
                    Add New Package
                </button>
            </div>

            <div className="space-y-12">
                {[0, 1, 2, 3, 4, 5].map((level) => {
                    const levelPackages = packages.filter(pkg => pkg.vipLevel === level);
                    if (levelPackages.length === 0 && !loading) return null;

                    return (
                        <div key={level} className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-2">
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${level === 0 ? 'from-slate-500 to-gray-400' : level === 1 ? 'from-indigo-500 to-blue-400' : level === 2 ? 'from-violet-500 to-purple-400' : level === 3 ? 'from-blue-500 to-cyan-400' : level === 4 ? 'from-purple-500 to-pink-500' : 'from-yellow-400 to-amber-500'} flex items-center justify-center text-xs text-white`}>
                                    Level {level + 1}
                                </div>
                                Packages for Level {level + 1}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {levelPackages.map((pkg) => (
                                    <div key={pkg._id} className="glass-card p-6 relative group border border-white/5 hover:border-blue-500/30 transition-all">
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => handleEdit(pkg)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all shadow-lg" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(pkg._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex gap-4 mb-5">
                                            {pkg.image && (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 shrink-0">
                                                    <img
                                                        src={pkg.image.startsWith('http') ? pkg.image : `${pkg.image}`}
                                                        alt={pkg.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-lg font-black text-white mb-1 truncate pr-16">{pkg.name}</h3>
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-bold w-fit ${pkg.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {pkg.isActive ? 'Active' : 'Inactive'}
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-blue-400 font-black text-lg leading-none">{pkg.dailyRate}%</span>
                                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Daily Profit</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40 font-medium">Duration</span>
                                                <span className="text-white font-bold">{pkg.duration} Days</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40 font-medium">Min Investment</span>
                                                <span className="text-white font-bold">${pkg.minAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/40 font-medium">Max Investment</span>
                                                <span className="text-white font-bold">${pkg.maxAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                                                <span className="text-white/40 font-medium">Level Required</span>
                                                <span className="text-yellow-400 font-black">LEVEL {pkg.vipLevel + 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {levelPackages.length === 0 && !loading && (
                                    <div className="col-span-full py-8 text-center text-white/20 border-2 border-dashed border-white/5 rounded-2xl">
                                        No packages in this level
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-200 rounded-xl p-6 w-full max-w-lg border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">
                            {editingPackage ? 'Edit Package' : 'New Package'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Package Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Duration (Days)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Min Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.minAmount}
                                        onChange={(e) => setFormData({ ...formData, minAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Max Amount</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.maxAmount}
                                        onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Daily Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.dailyRate}
                                        onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Level</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                        value={formData.vipLevel}
                                        onChange={(e) => setFormData({ ...formData, vipLevel: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/60 text-sm mb-1 block flex justify-between">
                                    <span>Package Image</span>
                                    <span className="text-[10px] text-blue-400 font-bold uppercase">1:1 Square (500x500px) Best</span>
                                </label>
                                <div className="flex gap-4 items-center">
                                    {formData.image && (
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                            <img src={formData.image.startsWith('http') ? formData.image : `${formData.image}`} className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 pl-3 text-white focus:outline-none focus:border-blue-500 text-sm pr-10"
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="URL or Upload -->"
                                        />
                                        <label className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white cursor-pointer transition-all shadow-lg" title="Upload Local File">
                                            <Upload size={14} />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Gradient Color (Tailwind)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        placeholder="from-blue-500 to-cyan-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/60 text-sm mb-1 block">Background Class</label>
                                    <input
                                        type="text"
                                        className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 font-mono text-xs"
                                        value={formData.bg}
                                        onChange={(e) => setFormData({ ...formData, bg: e.target.value })}
                                        placeholder="bg-blue-500/10"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded bg-dark-300 border-white/10 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="active" className="text-white text-sm">Active Package</label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
                                >
                                    {editingPackage ? 'Update Package' : 'Create Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPackages;
