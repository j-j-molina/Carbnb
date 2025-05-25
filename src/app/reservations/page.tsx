'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import app from '../../../firebase/firebase'; 

const RACING_RED = '#D5001F';

export default function ReservationsPage() {
  const [reservas, setReservas] = useState([]);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/');
        return;
      }
      setUser(currentUser);

      try {
        const reservasRef = collection(db, 'reservas');
        const q = query(reservasRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const datos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReservas(datos);
      } catch (error) {
        console.error('Error al obtener reservas:', error);
      }
    });

    return () => unsubscribeAuth();
  }, [auth, db, router]);

  const cerrarSesion = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh', color: '#fff', padding: '20px 32px' }}>
      {/* Header */}
      <header
        style={{
          background: RACING_RED,
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
          marginBottom: 20,
          borderRadius: 8,
        }}
      >
        <Link href="/">
          <img src="/logo.png" alt="Logo" style={{ height: 40, cursor: 'pointer' }} />
        </Link>

        <button
          onClick={cerrarSesion}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            color: '#fff',
            fontWeight: '700',
            fontSize: 16,
          }}
          title="Cerrar sesión"
        >
          <img src="/shutdown.png" alt="Cerrar sesión" style={{ height: 32, width: 32, marginRight: 8 }} />
          Cerrar sesión
        </button>
      </header>

      <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 20 }}>Mis Reservas</h1>

      {reservas.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: 16 }}>No tienes reservas activas.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              style={{
                background: '#181818',
                border: '2px solid #2d2d2d',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
                padding: 16,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 180,
              }}
            >
              <p><strong>Marca:</strong> {reserva.carMarca}</p>
              <p><strong>Modelo:</strong> {reserva.carModelo}</p>
              <p><strong>Desde:</strong> {reserva.startDate}</p>
              <p><strong>Hasta:</strong> {reserva.endDate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
