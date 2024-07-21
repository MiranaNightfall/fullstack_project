"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AddPaintingPage = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [date, setDate] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [theme, setTheme] = useState<string>('classic-theme');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would handle the form submission to add the painting
        router.push('/dashboard/blog');
    };

    const handleThemeChange = (theme: string) => {
        setTheme(theme);
    };

    return (
        <div className={theme}>
        <h1>Add Painting</h1>
        <button onClick={() => handleThemeChange('classic-theme')}>Classic Theme</button>
        <button onClick={() => handleThemeChange('futuristic-theme')}>Futuristic Theme</button>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
            <label>Price</label>
            <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
            <label>Image</label>
            <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            </div>
            <button type="submit">Add</button>
        </form>
        </div>
    );
};

export default AddPaintingPage;
