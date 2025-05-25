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

  const categories = ['Destacados', 'Vanes', 'SUVs', 'Sedanes', 'Especiales'];

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
        }}
      >
        <Image
          src="/background.jpg"
          alt="Fondo"
          fill
          style={{ objectFit: 'cover', zIndex: 1, opacity: 0.5 }}
        />
        <div style={{ position: 'relative', zIndex: 2, marginLeft: 40 }}>
          <Image src="/logo.png" alt="Carbnb Logo" width={260} height={110} />
        </div>
      </section>

      {/* Filtro de categorías y ordenamiento */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          margin: '24px 0 0 0',
          padding: '0 2rem',
        }}
      >
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
                marginRight: 2,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              background: RACING_RED,
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            <option value="">Precio: -</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>
        </div>
      </div>

      {/* Grid de autos */}
      <main
        style={{
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
        }}
      >
        {cars.map(car => (
          <div
            key={car.id}
            style={{ background: '#222', padding: 16, borderRadius: 12, color: '#fff' }}
          >
            <Image
              src={car.foto}
              alt={car.modelo}
              width={300}
              height={180}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
            <h2 style={{ margin: '8px 0' }}>
              {car.marca} {car.modelo}
            </h2>
            <p>Año: {car.anio || car.año}</p>
            <p>Pasajeros: {car.pasajeros}</p>
            <p>Puertas: {car.puertas}</p>
            <p>Combustible: {car.combustible}</p>
            <p>Carrocería: {car.carroceria}</p>
          </div>
        ))}
      </main>
    </div>
  );
}
