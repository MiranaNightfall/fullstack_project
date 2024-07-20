// src/app/landing/page.tsx
"use client"; // Add this line to indicate that this is a client component

import React, { useState } from 'react';

const images = [
    'art.png',
    'art3.png',
    'art5.png'
];

const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevSlide = () => {
        const index = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(index);
    };

    const nextSlide = () => {
        const index = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(index);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            // Implement your logout logic here
            window.location.href = ".."; // Redirect to the parent page or another page
        }
    };

    return (
        <div className="bg-gray-900 text-gray-300">
            <header className="bg-violet-900">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">ArtSelling</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><a href="#start" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Start</a></li>
                            <li><a href="#documentation" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Documentation</a></li>
                            <li><a href="#artwork" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Artwork</a></li>
                            <li><a href="#contacts" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Contacts</a></li>
                            <li><button onClick={handleLogout} className="text-gray-300 hover:text-cyan-200 smooth-scroll">Logout</button></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section id="start" className="bg-white py-20">
                <div className="flex flex-col justify-center items-center h-full text-center">
                    <h1 className="text-4xl font-bold text-violet-950">Sell your art with ArtSelling</h1>
                    <h2 className="mt-2"></h2>
                    <h3 className="mt-2 mb-4 text-black text-lg">Hello, </h3>

                    <div className="bg-gray-400 text-black mb-4 p-4 rounded-lg shadow-lg w-11/12 max-w-md text-center login-box">
                        <h1 className="text-2xl font-bold mb-4">Start Your Journey</h1>
                        <button className="p-2 w-full bg-violet-900 text-white rounded-md hover:bg-cyan-950">Get started</button>
                        <p className="mt-4 text-sm">Try Shopify free for 14 days. No risk, and no credit card required.</p>
                    </div>
                </div>
            </section>

            <section id="documentation" className="bg-gray-300 py-12">
                <div className="w-full max-w-4xl mx-auto relative">
                <h2 className="text-4xl font-semibold text-center mb-10 text-black">Check our documentation here!</h2>
                    <div className="flex justify-center items-center relative overflow-visible">
                        <button onClick={prevSlide} className="absolute left-0 bg-white text-black p-6 rounded-full">❮</button>
                        <img
                            src={images[currentIndex]}
                            alt="Art"
                            className="w-full rounded-lg shadow-lg transition-transform duration-500 ease-in-out"
                        />
                        <button onClick={nextSlide} className="absolute right-0 bg-white text-black p-6 rounded-full">❯</button>
                    </div>
                </div>
            </section>

            <section id="artwork" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-semibold text-center mb-10 text-gray-900">Greatest Painting on this Century</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="relative group bg-black p-6 shadow rounded">
                            <img src="pbc.png" alt="pablo-picasso" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-2xl font-bold mb-4">Girl before a Mirror</h3>
                                    <p className="text-gray-300">Girl before a Mirror is an oil on canvas painting by Pablo Picasso, which he created in 1932. The painting is a portrait of Picasso's mistress and muse, Marie-Thérèse Walter, who is depicted standing in front of a mirror looking at her reflection.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group bg-black p-6 shadow rounded">
                            <img src="art3.png" alt="van-gogh" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-2xl font-bold mb-4">The Starry Night</h3>
                                    <p className="text-gray-300">The Starry Night is an oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh, painted in June 1889. It depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group bg-black p-6 shadow rounded">
                            <img src="dali.png" alt="salvador-dali" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-2xl font-bold mb-4">
                                    The Disintegration of the Persistence of Memory</h3>
                                    <p className="text-gray-300">The Disintegration of the Persistence of Memory is an oil on canvas painting by the Spanish surrealist Salvador Dalí. It is a 1954 re-creation of the artist's famous 1931 work The Persistence of Memory, and measures a diminutive 25.4 × 33 cm.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacts" className="bg-gray-300 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-semibold text-center mb-10 text-black">Contact Me!</h2>
                    <form id="contact-form" className="max-w-xl mx-auto">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-black">Name:</label>
                            <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-black">Email:</label>
                            <input type="email" id="email" name="email" required className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-black">Message:</label>
                            <textarea id="message" name="message" required className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-700 text-white"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-yellow-900 text-white px-4 py-2 rounded-lg hover:bg-green-900">Send</button>
                    </form>
                </div>
            </section>

            <footer className="bg-violet-900 py-6 shadow ">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-100">&copy; Muhammad Afwan Hafizh. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
