<<<<<<< HEAD
import Image from "next/image";

export default function Home() {
=======
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Asegúrate que esta ruta sea correcta

const RACING_RED = '#D5001F';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Destacados');
  const [sort, setSort] = useState('');
  const [cars, setCars] = useState<any[]>([]);

  const categories = ['Destacados', 'Vans', 'SUV', 'Sedan', 'Especiales'];

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'carros'));
        const carsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carsData);
      } catch (error) {
        console.error('Error al obtener autos:', error);
      }
    };

    fetchCars();
  }, []);

>>>>>>> 2d4d086 (Modifications in page.tsx before changing to test)
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

<<<<<<< HEAD
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
=======
      {/* Imagen y logo */}
      <section style={{ position: 'relative', width: '100%', height: 340, overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#222' }}>
        <Image src="/background.jpg" alt="Fondo" fill style={{ objectFit: 'cover', zIndex: 1, opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 2, marginLeft: 40 }}>
          <Image src="/logo.png" alt="Carbnb Logo" width={260} height={110} />
        </div>
      </section>

      {/* Filtro de categorías y ordenamiento */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', margin: '24px 0 0 0', padding: '0 2rem' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat ? RACING_RED : '#fff',
                color: selectedCategory === cat ? '#fff' : RACING_RED,
                border: `2px solid ${RACING_RED}`,
                borderRadius: '8px 8px 0 0',
                fontWeight: 700,
                fontSize: 16,
                padding: '10px 32px',
                cursor: 'pointer',
                marginRight: 2
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ background: RACING_RED, color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            <option value="">-</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de autos */}
      <main style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {cars.map(car => (
          <div key={car.id} style={{ background: '#222', padding: 16, borderRadius: 12, color: '#fff' }}>
            <Image src={car.foto} alt={car.modelo} width={300} height={180} style={{ borderRadius: 8, objectFit: 'cover' }} />
            <h2 style={{ margin: '8px 0' }}>{car.marca} {car.modelo}</h2>
            <p>Año: {car.año}</p>
            <p>Pasajeros: {car.pasajeros}</p>
            <p>Puertas: {car.puertas}</p>
            <p>Combustible: {car.combustible}</p>
            <p>Carrocería: {car.carroceria}</p>
          </div>
        ))}
>>>>>>> 2d4d086 (Modifications in page.tsx before changing to test)
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
