import React, { useState, useEffect } from 'react';
import { emojiList } from '../../contants/emoji';

function EmojiList({ setEmoji }) {
    const [emojis, setEmojis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');

    console.log("emo", emojiList);


    useEffect(() => {
        // const fetchEmojis = async () => {
        //     try {
        //         const response = await fetch('https://www.emoji.family/api/emojis', {
        //             method: 'GET',
        //             headers: {
        //                 'Accept': 'application/json',
        //                 // You might need an API key or specific headers depending on the API
        //                 // 'Authorization': 'Bearer YOUR_API_KEY',
        //             },
        //             mode: 'cors', // Explicitly set CORS mode
        //             credentials: 'same-origin', // or 'include' if auth is needed
        //         });

        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${response.status}`);
        //         }

        //         const data = await response.json();
        //         setEmojis(data);
        //         setLoading(false);
        //     } catch (err) {
        //         console.error('Fetch error:', err);
        //         setError(err.message || 'Failed to fetch emojis. This might be due to CORS restrictions or network issues.');
        //         setLoading(false);
        //     }
        // };

        // fetchEmojis();
    }, []);

    const groups = ['all', ...new Set(emojiList.map(emoji => emoji.group))];

    const filteredEmojis = emojiList.filter(emoji => {
        const matchesSearch = emoji.annotation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emoji.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesGroup = selectedGroup === 'all' || emoji.group === selectedGroup;
        return matchesSearch && matchesGroup;
    });


    if (loading) {
        return <div className="text-center text-gray-500 py-10">Loading emojis...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-10">Error: {error}</div>;
    }

    const groupToFirstEmoji = groups.reduce((acc, group) => {
        if (group === 'all') {
            acc[group] = '🌟';
        } else {
            const firstEmoji = emojiList.find(emoji => emoji.group === group)?.emoji || '❓';
            acc[group] = firstEmoji;
        }
        return acc;
    }, {});

    return (
        <div className="container mx-auto p-4">

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search emoji"
                    className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Group Tabs */}
            <div className="flex overflow-x-auto mb-4 border-b border-gray-200 gap-2">
                {groups.map(group => (
                    <button
                        key={group}
                        onClick={() => setSelectedGroup(group)}
                        className={`px-4 py-2 text-sm font-medium flex items-center ${selectedGroup === group
                            ? 'border-b-2 border-blue-500 text-blue-500'
                            : 'text-gray-600'
                            }`}
                    >
                        <span className="text-2xl">{groupToFirstEmoji[group]}</span>
                    </button>
                ))}
            </div>

            {/* Emoji Grid with Scroll */}
            <div className="cursor-pointer grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-1 h-[200px] overflow-y-auto ">
                {filteredEmojis.map((emoji) => (
                    <div
                        key={emoji.hexcode}
                        onClick={() => setEmoji(emoji.emoji)}
                        title={emoji.annotation}
                    >
                        <span className="text-2xl">{emoji.emoji}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EmojiList;