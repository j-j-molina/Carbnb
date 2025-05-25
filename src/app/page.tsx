'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

const RACING_RED = '#D5001F';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Destacados');
  const [sort, setSort] = useState('');
  const [cars, setCars] = useState<any[]>([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['Destacados', '2 Pasajeros', '5 Pasajeros', '6 - 8 Pasajeros', 'Especiales'];

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

  const filteredCars = cars
    .filter(car => {
      if (selectedCategory === 'Destacados') return true;
      if (selectedCategory === '2 Pasajeros') return car.pasajeros === 2;
      if (selectedCategory === '5 Pasajeros') return car.pasajeros === 5;
      if (selectedCategory === '6 - 8 Pasajeros') return car.pasajeros >= 6 && car.pasajeros <= 8;
      if (selectedCategory === 'Especiales') return ['coupé', 'coupe'].includes(car.carroceria?.toLowerCase());
      return true;
    })
    .sort((a, b) => {
      if (sort === 'asc') return a.precio - b.precio;
      if (sort === 'desc') return b.precio - a.precio;
      return 0;
    });

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111' }}>
      {/* Header */}
      <header
        style={{
          background: RACING_RED,
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          height: 60,
        }}
      >
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          {user ? (
            <>
              <Link href="/reservaciones">
                <button
                  style={{
                    background: '#bd162c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                >
                  Mis Reservaciones
                </button>
              </Link>
              <button
                onClick={() => signOut(auth)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  marginLeft: 8,
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Cerrar sesión"
              >
                <img src="/shutdown.png" alt="Cerrar sesión" style={{ height: 32, width: 32 }} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button
                  style={{
                    background: '#bd162c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                >
                  Iniciar Sesión
                </button>
              </Link>
              <Link href="/register">
                <button
                  style={{
                    background: '#bd162c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 20px',
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                >
                  Registrarse
                </button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Imagen y logo */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: 340,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: '#222',
          marginBottom: 0,
        }}
      >
        <Image
          src="/background.jpg"
          alt="Fondo"
          fill
          style={{ objectFit: 'cover', zIndex: 1, opacity: 0.5 }}
        />
        <div style={{ position: 'relative', zIndex: 2, marginLeft: 40 }}>
          <Image src="/logo.png" alt="Carbnb Logo" width={314.6} height={133.1} />
        </div>
        <div style={{ position: 'absolute', top: '92%', right: '2.2%', zIndex: 3, transform: 'translateY(-50%)' }}>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: RACING_RED,
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 24px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <option value="">Precio: -</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </section>

      {/* Filtros de categorías */}
      <div style={{ display: 'flex', width: '100%', background: '#222', padding: '0 2rem', borderBottom: `2px solid ${RACING_RED}` }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              flex: 1,
              background: selectedCategory === category ? '#fff' : RACING_RED,
              color: selectedCategory === category ? '#111' : '#fff',
              border: `2px solid ${RACING_RED}`,
              borderBottom: selectedCategory === category ? 'none' : `2px solid ${RACING_RED}`,
              borderRadius: '8px 8px 0 0',
              fontWeight: 700,
              fontSize: 16,
              padding: '10px 0',
              cursor: 'pointer',
              marginRight: category !== categories[categories.length - 1] ? 2 : 0,
              transition: 'background 0.2s, color 0.2s',
              zIndex: 4
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid de autos */}
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '18px',
          background: '#330000',
          padding: '10px 32px',
        }}
      >
        {filteredCars.map((car, idx) => (
          <Link href={`/car/${car.id}`} key={car.id || idx} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: '#181818',
                border: '2px solid #2d2d2d',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
                padding: '0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                minHeight: '280px',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '100%', height: '180px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={car.foto || car.imageUrl} alt={car.modelo || car.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '1.1rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{car.modelo || car.name}</div>
                <div style={{ color: '#ccc', fontSize: '0.9rem', marginBottom: '8px' }}>{car.carroceria || car.category}</div>
                <div style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '8px' }}>{car.marca || ''} {car.año || car.year} | {car.pasajeros || car.passengers} pasajeros | {car.combustible || car.fuel}</div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#a00', color: '#fff', fontWeight: 'bold', padding: '6px 14px', fontSize: '1rem', borderTopLeftRadius: '8px' }}>
                  ${car.precio ? car.precio.toLocaleString() : '1,000,000'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

