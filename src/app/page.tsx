'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RACING_RED = '#D5001F';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Destacados');
  const [sort, setSort] = useState('');
  const categories = ['Destacados', '2 puertas', '4 puertas', '6 puertas', 'Especiales'];
  const cars = [
    // ... tus datos de autos ...
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111' }}>
      {/* Header */}
      <header style={{ background: RACING_RED, padding: '0.5rem 2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: 60 }}>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <Link href="/login"><button style={{ background: RACING_RED, color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Iniciar Sesión</button></Link>
          <Link href="/register"><button style={{ background: RACING_RED, color: '#fff', border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Registrarse</button></Link>
        </div>
      </header>

      {/* Logo sobre fondo de imagen */}
      <section style={{ position: 'relative', width: '100%', height: 340, overflow: 'hidden', display: 'flex', alignItems: 'center', background: '#222' }}>
        <Image src="/cars3.jpg" alt="Fondo" fill style={{ objectFit: 'cover', zIndex: 1, opacity: 0.5 }} />
        <div style={{ position: 'relative', zIndex: 2, marginLeft: 40 }}>
          <Image src="/logo.png" alt="Carbnb Logo" width={260} height={110} />
        </div>
      </section>

      {/* Filtro y categorías */}
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

      {/* Aquí iría el grid de autos */}
      <main style={{ padding: '2rem' }}>
        {/* ... tu grid de autos ... */}
      </main>
    </div>
  );
}
