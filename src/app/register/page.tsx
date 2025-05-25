'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase'; // asegúrate que esta ruta sea correcta
import Link from 'next/link';

const RACING_RED = '#D5001F';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Error al registrar');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: RACING_RED, padding: '0.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 60 }}>
        <Link href="/"><h1 style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Carbnb</h1></Link>
        <Link href="/login"><button style={{ background: '#fff', color: RACING_RED, border: 'none', borderRadius: 4, padding: '8px 20px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Iniciar Sesión</button></Link>
      </header>

      <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleRegister} style={{ background: '#222', padding: 32, borderRadius: 12, width: 400, display: 'flex', flexDirection: 'column', gap: 16, color: '#fff' }}>
          <h2 style={{ textAlign: 'center' }}>Crear Cuenta</h2>

          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }} />

          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }} />

          <button type="submit" style={{ background: RACING_RED, color: '#fff', padding: 12, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Registrarse
          </button>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'lightgreen', textAlign: 'center' }}>{success}</p>}

          <p style={{ textAlign: 'center' }}>¿Ya tienes cuenta? <Link href="/login" style={{ color: RACING_RED }}>Inicia sesión</Link></p>
        </form>
      </main>
    </div>
  );
}
