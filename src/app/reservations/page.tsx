'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import app from '../../../firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

const RACING_RED = '#D5001F';

export default function ReservationsPage() {
  const [reservas, setReservas] = useState([]);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [carros, setCarros] = useState({});

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
        // Fetch car details for each reservation
        const carData = {};
        for (const reserva of datos) {
          if (reserva.carId && !carData[reserva.carId]) {
            const carDoc = await getDoc(doc(db, 'carros', reserva.carId));
            if (carDoc.exists()) {
              carData[reserva.carId] = carDoc.data();
            }
          }
        }
        setCarros(carData);
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
    <div style={{ minHeight: "100vh", background: "#330000", padding: 0 }}>
      <header style={{ background: '#d5001c', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <a href="/">
          <img src="/logo.png" alt="Carbnb Logo" style={{ height: '120px', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 32 }}>
          {!user ? (
            <></>
          ) : (
            <button onClick={cerrarSesion} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <img src="/shutdown.png" alt="Cerrar sesión" style={{ height: 28, width: 28 }} />
            </button>
          )}
        </div>
      </header>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
        <div style={{
          display: "flex",
          background: "#bd162c",
          borderRadius: 18,
          boxShadow: "0 8px 32px #000a",
          marginTop: 24,
          width: 900,
          minHeight: 666,
          overflow: "hidden",
          padding: 20
        }}>
          <div style={{ width: '100%' }}>
            <h1 style={{ fontWeight: 700, fontSize: 28, marginBottom: 20, color: 'white' }}>Mis Reservas</h1>
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
                {reservas.map((reserva) => {
                  const car = carros[reserva.carId] || {};
                  // Parse price (remove dots and $)
                  const precioPorDia = car.precio ? parseInt((car.precio + '').replace(/[^\d]/g, '')) : 0;
                  const start = new Date(reserva.startDate);
                  const end = new Date(reserva.endDate);
                  const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                  const total = precioPorDia * days;
                  return (
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        minHeight: 220,
                        gap: 32
                      }}
                    >
                      <div style={{ flex: 2 }}>
                        <p><strong>Marca:</strong> {reserva.carMarca}</p>
                        <p><strong>Modelo:</strong> {reserva.carModelo}</p>
                        <p><strong>Desde:</strong> {reserva.startDate}</p>
                        <p><strong>Hasta:</strong> {reserva.endDate}</p>
                      </div>
                      <div style={{ flex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {car.foto && (
                          <img
                            src={car.foto}
                            alt={car.modelo}
                            style={{ width: 260, height: 160, objectFit: 'cover', borderRadius: 12, background: '#222', marginBottom: 18 }}
                          />
                        )}
                        <span style={{ color: '#fff', fontWeight: 900, fontSize: 28, marginTop: 8 }}>
                          Precio Total: ${total}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
