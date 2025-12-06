import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Save, FileText } from 'lucide-react';

interface ContentSection {
    section: string;
    data: any;
}

const ContentEditor: React.FC = () => {
    const [sections, setSections] = useState<ContentSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error) throw error;
            setSections(data || []);

            // Load hero section by default
            const heroSection = data?.find(s => s.section === 'hero');
            if (heroSection) {
                setFormData(heroSection.data);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSectionChange = (section: string) => {
        setActiveSection(section);
        const sectionData = sections.find(s => s.section === section);
        setFormData(sectionData?.data || {});
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('site_content')
                .upsert({
                    section: activeSection,
                    data: formData,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'section'
                });

            if (error) throw error;

            alert('Content saved successfully!');
            fetchContent();
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Failed to save content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Section Selector */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="font-semibold text-gray-900 mb-4">Sections</h2>
                        <div className="space-y-2">
                            {['hero', 'about', 'contact_info', 'footer'].map((section) => (
                                <button
                                    key={section}
                                    onClick={() => handleSectionChange(section)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition ${activeSection === section
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        <span className="capitalize">{section.replace('_', ' ')}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Editor */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 capitalize">
                            {activeSection.replace('_', ' ')} Section
                        </h2>

                        <div className="space-y-4">
                            {activeSection === 'hero' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Welcome to Intravvel"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                        <input
                                            type="text"
                                            value={formData.subtitle || ''}
                                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Your journey begins here"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.background_image || ''}
                                            onChange={(e) => setFormData({ ...formData, background_image: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="https://example.com/hero-bg.jpg"
                                        />
                                    </div>
                                </>
                            )}

                            {activeSection === 'about' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                                        <input
                                            type="text"
                                            value={formData.heading || ''}
                                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="About Us"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                        <textarea
                                            value={formData.content || ''}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            rows={6}
                                            placeholder="Tell your story..."
                                        />
                                    </div>
                                </>
                            )}

                            {activeSection === 'contact_info' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input
                                            type="text"
                                            value={formData.address || ''}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="123 Travel Street, City"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone || ''}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email || ''}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="info@intravvel.com"
                                        />
                                    </div>
                                </>
                            )}

                            {activeSection === 'footer' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                                        <input
                                            type="text"
                                            value={formData.copyright || ''}
                                            onChange={(e) => setFormData({ ...formData, copyright: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            placeholder="© 2024 Intravvel. All rights reserved."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            rows={3}
                                            placeholder="Footer description..."
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentEditor;
