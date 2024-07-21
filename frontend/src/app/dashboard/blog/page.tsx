"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from "next/image";
import styles from './stylepage.module.css'; 

interface Painting {
    id: number;
    name: string;
    price: string;
    date: string;
    image: string;
}

const PaintingsPage = () => {
    const [paintings, setPaintings] = useState<Painting[]>([]);

    useEffect(() => {
        setPaintings([
            { id: 1, name: 'Random Painting', price: '$780 million', date: '2023-07-19', image: 'art.png' },
            { id: 2, name: 'Starry Night', price: '$100 million', date: '2023-07-20', image: 'art2.png' },
            { id: 3, name: 'Mona Lisa', price: '$850 million', date: '2023-07-21', image: 'art3.png' },
            { id: 4, name: 'The Scream', price: '$120 million', date: '2023-07-22', image: 'art4.png' },
            { id: 5, name: 'Persistence of Memory', price: '$200 million', date: '2023-07-23', image: 'art5.png' },
        ]);
    }, []);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Welcome, ArtSeller!</h1>
            </header>

            <div className={styles.buttonGroup}>
                <Link href="/dashboard">
                    <button className={styles.backButton}>Back to Dashboard</button>
                </Link>
                <Link href="/dashboard/blog">
                    <button className={styles.addButton}>Add Painting</button>
                </Link>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th>Image</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paintings.map((painting, index) => (
                        <tr key={painting.id}>
                            <td>{index + 1}</td>
                            <td>{painting.name}</td>
                            <td>{painting.price}</td>
                            <td>{painting.date}</td>
                            <td><Image src={painting.image} alt={painting.name} className={styles.image} /></td>
                            <td>
                                <Link href={`/dashboard/blog`}>
                                    <button className={styles.editButton}>Edit</button>
                                </Link>
                                <button className={styles.deleteButton}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PaintingsPage;
