import React, { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

const AIGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/ai/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) throw new Error('Failed to generate content');

            const data = await response.json();
            setGeneratedContent(data.content);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content. Make sure GEMINI_API_KEY is configured.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const templates = [
        {
            title: 'Service Description',
            prompt: 'Create a compelling travel service description for a luxury beach resort package in Bali. Include highlights, activities, and why travelers should choose this package.'
        },
        {
            title: 'Email Response',
            prompt: 'Write a professional email response to a customer inquiry about booking a family vacation package for 4 people.'
        },
        {
            title: 'Social Media Post',
            prompt: 'Create an engaging Instagram caption for a travel agency promoting a new European tour package.'
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Content Generator</h1>
                <p className="text-gray-600">Generate content using Google Gemini AI</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Templates */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h2 className="font-semibold text-gray-900 mb-4">Quick Templates</h2>
                        <div className="space-y-2">
                            {templates.map((template, index) => (
                                <button
                                    key={index}
                                    onClick={() => setPrompt(template.prompt)}
                                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <h3 className="font-medium text-gray-900 text-sm">{template.title}</h3>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{template.prompt}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Generator */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Input */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={6}
                            placeholder="Describe what content you want to generate..."
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !prompt.trim()}
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Sparkles className="w-5 h-5" />
                            {loading ? 'Generating...' : 'Generate Content'}
                        </button>
                    </div>

                    {/* Output */}
                    {generatedContent && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Generated Content</h2>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-600" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="prose max-w-none">
                                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-700">
                                    {generatedContent}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIGenerator;
