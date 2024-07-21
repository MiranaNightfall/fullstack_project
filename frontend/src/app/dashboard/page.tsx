"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaEnvelope, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

const images = [
    'art.png',
    'art3.png',
    'art5.png'
];

const LandingPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
        } else {
            setIsAuthenticated(true);
        }

        const smoothScroll = (e: MouseEvent) => {
            e.preventDefault();
            const target = e.currentTarget as HTMLAnchorElement;
            const targetId = target.getAttribute('href');
            if (targetId) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
                }
            };
            
            const links = document.querySelectorAll<HTMLAnchorElement>('.smooth-scroll');
            links.forEach(link => {
                link.addEventListener('click', smoothScroll);
            });
            
            return () => {
                links.forEach(link => {
                link.removeEventListener('click', smoothScroll);
            });
        };
    }, [router]);

    if (!isAuthenticated) {
        return <div>Login first, please...</div>;
    }

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
            localStorage.removeItem('token');
            router.push('/');
        }
    };

    return (
        <div className="bg-gray-900 text-gray-300">
            <style jsx>{`
                .section-padding {
                    padding-top: 80px;
                }
                .scroll-margin {
                    scroll-margin-top: 80px;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
            `}</style>

            <header className="bg-violet-900 fixed top-0 left-0 w-full z-50">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white">ArtSelling</h1>
                    <nav>
                        <ul className="flex space-x-4">
                            <li><a href="#about" className="text-gray-300 hover:text-cyan-200 smooth-scroll">About</a></li>
                            <li><a href="#documentation" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Documentation</a></li>
                            <li><a href="#artwork" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Artwork</a></li>
                            <li><a href="#contacts" className="text-gray-300 hover:text-cyan-200 smooth-scroll">Contacts</a></li>
                            <li><a onClick={handleLogout} className="text-gray-300 hover:text-cyan-200 smooth-scroll cursor-pointer">Logout</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section id="about" className="bg-gradient-to-r from-white to-cyan-600 py-20 min-h-screen flex items-center section-padding scroll-margin">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-violet-950 leading-tight mb-4">Grab an Opportunity with ArtSelling!</h1>
                        <p className="text-lg text-violet-900 mb-8">
                            ArtSelling is a marketplace for those who wish to sell their creations. You can sell a variety of works, including both two-dimensional and three-dimensional pieces, based on your creativity. Additionally, you have the freedom to set your own prices because "every artist undoubtedly has their unique value."
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <Link href="/dashboard/blog">
                                <button className="bg-pink-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-pink-700">
                                    Join Now
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <img src="art4.png" alt="Ultrabook" className="w-auto h-auto rounded-lg shadow-lg" />
                    </div>
                </div>
            </section>

            <section id="documentation" className="bg-gray-300 py-12 section-padding scroll-margin">
                <div className="w-full max-w-4xl mx-auto relative">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-black">Check our documentation here!</h2>
                    <div className="flex justify-center items-center relative overflow-visible">
                        <button onClick={prevSlide} className="absolute left-0 bg-white text-black p-2 md:p-6 rounded-full">❮</button>
                        <img
                            src={images[currentIndex]}
                            alt="Art"
                            className="w-full h-auto object-cover rounded-lg shadow-lg transition-transform duration-500 ease-in-out"
                        />
                        <button onClick={nextSlide} className="absolute right-0 bg-white text-black p-2 md:p-6 rounded-full">❯</button>
                    </div>
                </div>
            </section>

            <section id="artwork" className="py-20 bg-gradient-to-r from-cyan-600 to-white section-padding scroll-margin">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-gray-900">Greatest Painting on this Century</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="relative group bg-black p-4 md:p-6 shadow rounded">
                            <img src="pbc.png" alt="pablo-picasso" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-xl md:text-2xl font-bold mb-4">Girl before a Mirror</h3>
                                    <p className="text-gray-300">Girl before a Mirror is an oil on canvas painting by Pablo Picasso, which he created in 1932. The painting is a portrait of Picasso's mistress and muse, Marie-Thérèse Walter, who is depicted standing in front of a mirror looking at her reflection.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group bg-black p-4 md:p-6 shadow rounded">
                            <img src="art3.png" alt="van-gogh" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-xl md:text-2xl font-bold mb-4">The Starry Night</h3>
                                    <p className="text-gray-300">The Starry Night is an oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh, painted in June 1889. It depicts the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence, just before sunrise, with the addition of an imaginary village.</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative group bg-black p-4 md:p-6 shadow rounded">
                            <img src="dali.png" alt="salvador-dali" className="w-full h-48 object-cover rounded mb-4 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                                <div className="text-center text-white px-4 py-2">
                                    <h3 className="text-xl md:text-2xl font-bold mb-4">The Disintegration of the Persistence of Memory</h3>
                                    <p className="text-gray-300">The Disintegration of the Persistence of Memory is an oil on canvas painting by the Spanish surrealist Salvador Dalí. It is a 1954 re-creation of the artist's famous 1931 work The Persistence of Memory, and measures a diminutive 25.4 × 33 cm.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contacts" className="bg-gray-300 py-20 section-padding scroll-margin">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-10 text-black">Contact Me!</h2>
                    <div className="flex justify-center space-x-8 mb-10">
                        <a href="https://wa.me/081219357530" className="text-gray-900 hover:text-green-500" target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={40} />
                        </a>
                        <a href="mailto:mirananightfall228@gmail.com" className="text-gray-900 hover:text-red-500" target="_blank" rel="noopener noreferrer">
                            <FaEnvelope size={40} />
                        </a>
                        <a href="https://github.com/MiranaNightfall" className="text-gray-900 hover:text-blue-700" target="_blank" rel="noopener noreferrer">
                            <FaGithub size={40} />
                        </a>
                    </div>
                    <div className="max-w-xl mx-auto text-center">
                        <p className="text-lg text-gray-700">I am a computer science student. A beginner that currently learning full stack development.</p>
                    </div>
                </div>
            </section>

            <footer className="bg-violet-900 py-6 shadow">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-100">&copy; Muhammad Afwan Hafizh. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
