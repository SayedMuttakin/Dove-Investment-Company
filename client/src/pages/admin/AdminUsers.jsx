import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Search } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ balance: '', vipLevel: '' });

    useEffect(() => {
        fetchUsers();
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const trimmedSearch = searchTerm.trim();
            const url = trimmedSearch
                ? `/api/admin/users?search=${encodeURIComponent(trimmedSearch)}`
                : '/api/admin/users';

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setEditForm({ balance: user.balance ?? 0, vipLevel: user.vipLevel ?? 0 });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/admin/user/${editingUser._id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowModal(false);
            setEditingUser(null);
            fetchUsers();
            toast.success('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user');
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-white">Registered Users</h2>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                    <input
                        type="search"
                        placeholder="Search users..."
                        className="bg-dark-200 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 w-full text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">User</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Invite Code</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Balance</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">VIP</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Joined</th>
                                <th className="p-4 text-xs font-bold text-white/60 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-white/40 text-sm">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-white/40 text-sm">No users found.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="text-white font-medium text-sm">{user.fullName || 'No Name'}</div>
                                            <div className="text-white/60 text-xs">{user.phone || user.email || 'No Contact'}</div>
                                        </td>
                                        <td className="p-4 text-white/60 text-xs font-mono">{user.invitationCode || 'N/A'}</td>
                                        <td className="p-4 text-green-400 font-bold text-sm">${(user.balance || 0).toFixed(2)}</td>
                                        <td className="p-4 text-yellow-400 text-sm font-bold">Lvl {(user.vipLevel ?? 0) + 1}</td>
                                        <td className="p-4 text-white/60 text-xs text-nowrap">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-dark-200 rounded-xl p-6 w-full max-w-sm border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">Edit User</h3>
                        <p className="text-white/60 text-sm mb-4">Editing info for {editingUser?.fullName || editingUser?.phone || editingUser?.email}</p>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">Balance ($)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={editForm.balance}
                                    onChange={(e) => setEditForm({ ...editForm, balance: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-sm mb-1 block">VIP Level</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full bg-dark-300 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                                    value={editForm.vipLevel}
                                    onChange={(e) => setEditForm({ ...editForm, vipLevel: e.target.value })}
                                />
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
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
