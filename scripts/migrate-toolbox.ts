import dotenv from 'dotenv';
dotenv.config();
import { db } from './db-client';

async function migrate() {
    console.log('Creating toolbox tables...');

    // Categories table (e.g. "Akademis DTE", "Media Belajar", "Transisi Kurikulum")
    await db.execute(`
        CREATE TABLE IF NOT EXISTS toolbox_categories (
            id TEXT PRIMARY KEY,
            label TEXT NOT NULL,
            is_grouped INTEGER NOT NULL DEFAULT 0,
            order_index INTEGER NOT NULL DEFAULT 0
        )
    `);
    console.log('Created toolbox_categories table');

    // Items table — supports both flat links and grouped links
    await db.execute(`
        CREATE TABLE IF NOT EXISTS toolbox_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category_id TEXT NOT NULL,
            group_name TEXT,
            title TEXT NOT NULL,
            description TEXT,
            href TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT 'FolderOpen',
            order_index INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (category_id) REFERENCES toolbox_categories(id) ON DELETE CASCADE
        )
    `);
    console.log('Created toolbox_items table');

    // Seed from existing resourceCategories.json
    console.log('Seeding data from resourceCategories.json...');

    const categories = [
        { id: 'transisi', label: 'Transisi Kurikulum', is_grouped: 1, order_index: 0 },
        { id: 'akademis', label: 'Akademis DTE', is_grouped: 0, order_index: 1 },
        { id: 'media', label: 'Media Belajar', is_grouped: 0, order_index: 2 },
    ];

    for (const cat of categories) {
        await db.execute({
            sql: 'INSERT OR IGNORE INTO toolbox_categories (id, label, is_grouped, order_index) VALUES (?, ?, ?, ?)',
            args: [cat.id, cat.label, cat.is_grouped, cat.order_index]
        });
    }

    const items = [
        // Transisi Kurikulum (grouped)
        { category_id: 'transisi', group_name: 'Teknik Elektro', title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1FllbkS93HozAnkxucC3njZFyogbafZ6U/view?usp=sharing', icon: 'FolderOpen', order_index: 0 },
        { category_id: 'transisi', group_name: 'Teknik Elektro', title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1wrORAn5yPMr3ANLlYJjNgBqtkjMBoaPw/edit?usp=sharing', icon: 'FolderOpen', order_index: 1 },
        { category_id: 'transisi', group_name: 'Teknik Komputer', title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1BazEeK_Djk-72pOcavnGf5uan7ZqrMRY/view', icon: 'FolderOpen', order_index: 0 },
        { category_id: 'transisi', group_name: 'Teknik Komputer', title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1xIXdrp50kvbGevwgBTDAgKUvwDmOZFur/edit?usp=sharing', icon: 'FolderOpen', order_index: 1 },
        { category_id: 'transisi', group_name: 'Teknik Biomedik', title: 'Aturan Transisi Kurikulum', href: 'https://drive.google.com/file/d/1OrONufdYmcRokcZoOu3JU7jJ6dapY-Tq/view?usp=sharing', icon: 'FolderOpen', order_index: 0 },
        { category_id: 'transisi', group_name: 'Teknik Biomedik', title: 'Simulasi Transisi Kurikulum', href: 'https://docs.google.com/spreadsheets/d/1QXGqhLqapza_Iuqha61qBjEVci083vcb/edit?usp=sharing', icon: 'FolderOpen', order_index: 1 },

        // Akademis DTE (flat)
        { category_id: 'akademis', title: 'Kalender FTUI', description: 'Genap 2025/2026', href: 'https://drive.google.com/file/d/1AT30fW77EQTK3WBDl0rMtbRzDaHzKsIF/view?usp=sharing', icon: 'Calendar', order_index: 0 },
        { category_id: 'akademis', title: 'MBKM 2024', description: 'Rekaman Sosialisasi', href: 'https://youtu.be/5YZFkQfC-7g?si=GsUDP0jHBv89PTI2', icon: 'Youtube', order_index: 1 },
        { category_id: 'akademis', title: 'Buku EE', description: 'Kurikulum Elektro', href: 'https://online.pubhtml5.com/sstc/yjeo/', icon: 'BookOpen', order_index: 2 },
        { category_id: 'akademis', title: 'Buku CE', description: 'Kurikulum Komputer', href: 'https://online.pubhtml5.com/sstc/kcli/', icon: 'BookOpen', order_index: 3 },
        { category_id: 'akademis', title: 'Buku BME', description: 'Kurikulum Biomedik', href: 'https://online.pubhtml5.com/sstc/swrt/', icon: 'BookOpen', order_index: 4 },

        // Media Belajar (flat)
        { category_id: 'media', title: 'DTE E-book', description: 'Kumpulan E-book Mata Kuliah', href: 'https://drive.google.com/drive/folders/1VJlvzJXKLQNutvG_ieRvpvDJbaV6p2b6?usp=drive_link', icon: 'FolderOpen', order_index: 0 },
        { category_id: 'media', title: 'Playlist DRL', description: 'Dasar Rangkaian Listrik', href: 'https://youtube.com/playlist?list=PLvvIG2wS7Z6H11k9_Vzy9X7hBDDT5E5Gb', icon: 'Youtube', order_index: 1 },
        { category_id: 'media', title: 'Playlist RL Pak Tomy', description: 'Materi Rangkaian Listrik', href: 'https://youtube.com/playlist?list=PLPo1kEEL45jz3t2n0iVZBiZOXtfrZgWYP', icon: 'Youtube', order_index: 2 },
        { category_id: 'media', title: 'Playlist DSD', description: 'Dasar Sistem Digital', href: 'https://youtube.com/playlist?list=PLF9K2dVsV_xK8wSXt5Gi24lhYFhWx0HzA', icon: 'Youtube', order_index: 3 },
        { category_id: 'media', title: 'Playlist MT Pak Tomy', description: 'Materi Matematika Teknik', href: 'https://youtube.com/playlist?list=PLPo1kEEL45jyOsWa4zuKJymIGs9L0s1Yq', icon: 'Youtube', order_index: 4 },
    ];

    for (const item of items) {
        await db.execute({
            sql: 'INSERT INTO toolbox_items (category_id, group_name, title, description, href, icon, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [
                item.category_id,
                (item as any).group_name || null,
                item.title,
                (item as any).description || null,
                item.href,
                item.icon,
                item.order_index
            ]
        });
    }

    console.log(`Seeded ${categories.length} categories and ${items.length} items`);
    console.log('Migration complete!');
}

migrate().catch(console.error);
