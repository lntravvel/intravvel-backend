import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Mail, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Message {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'archived';
    created_at: string;
}

const Messages: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            fetchMessages();
        } catch (error) {
            console.error('Error updating message:', error);
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setSelectedMessage(null);
            fetchMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    const handleMessageClick = (message: Message) => {
        setSelectedMessage(message);
        if (message.status === 'new') {
            updateStatus(message.id, 'read');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Messages List */}
            <div className="lg:col-span-1 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                    <p className="text-sm text-gray-600">{messages.length} total</p>
                </div>
                <div className="overflow-y-auto h-[calc(100%-5rem)]">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            onClick={() => handleMessageClick(message)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${selectedMessage?.id === message.id ? 'bg-indigo-50' : ''
                                } ${message.status === 'new' ? 'bg-blue-50' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-1">
                                <h3 className="font-semibold text-gray-900 truncate flex-1">{message.name}</h3>
                                {message.status === 'new' && (
                                    <Circle className="w-3 h-3 fill-blue-500 text-blue-500 flex-shrink-0" />
                                )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {new Date(message.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                {selectedMessage ? (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b bg-gray-50">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                        {selectedMessage.subject}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>{selectedMessage.email}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateStatus(selectedMessage.id, 'archived')}
                                        className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition"
                                    >
                                        Archive
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded transition flex items-center gap-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">From:</span>
                                <span className="text-sm text-gray-900">{selectedMessage.name}</span>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p>Select a message to view</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
