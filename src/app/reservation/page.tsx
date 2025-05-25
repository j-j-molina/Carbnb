'use client';

import Image from 'next/image';
import Link from 'next/link';

const RACING_RED = '#D5001F';

export default function ReservaExitosa() {
  const reserva = {
    marca: 'Toyota',
    modelo: 'Corolla',
    anio: 2020,
    pasajeros: 5,
    puertas: 4,
    combustible: 'Gasolina',
    carroceria: 'Sedán',
    foto: '/background2.jpg',
    fechaInicio: '2025-06-01',
    fechaFin: '2025-06-05',
    precioTotal: '$950.000 COP'
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <header
        style={{
          background: RACING_RED,
          padding: '0.5rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 60,
        }}
      >
        <Link href="/">
          <Image src="/logo.png" alt="Carbnb Logo" width={150} height={50} />
        </Link>
        <Link href="/">
          <button
            style={{
              background: RACING_RED,
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '8px 20px',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Volver al Inicio
          </button>
        </Link>
      </header>

      {/* Contenido */}
      <main style={{ maxWidth: 800, margin: '40px auto', background: '#222', padding: 32, borderRadius: 12 }}>
        <h1 style={{ fontSize: 28, marginBottom: 16, color: RACING_RED }}>¡Reserva Confirmada!</h1>

        <p style={{ marginBottom: 24 }}>
          Tu reserva ha sido procesada exitosamente. Aquí están los detalles:
        </p>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Image
            src={reserva.foto}
            alt={reserva.modelo}
            width={300}
            height={180}
            style={{ borderRadius: 8, objectFit: 'cover' }}
          />
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 8 }}>{reserva.marca} {reserva.modelo}</h2>
            <p><strong>Año:</strong> {reserva.anio}</p>
            <p><strong>Pasajeros:</strong> {reserva.pasajeros}</p>
            <p><strong>Puertas:</strong> {reserva.puertas}</p>
            <p><strong>Combustible:</strong> {reserva.combustible}</p>
            <p><strong>Carrocería:</strong> {reserva.carroceria}</p>
            <p><strong>Desde:</strong> {reserva.fechaInicio}</p>
            <p><strong>Hasta:</strong> {reserva.fechaFin}</p>
            <p><strong>Total:</strong> {reserva.precioTotal}</p>
          </div>
        </div>

        <div style={{ marginTop: 32 }}>
          <Link href="/">
            <button
              style={{
                background: RACING_RED,
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Ver más autos
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
