'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const RACING_RED = '#D5001F';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      router.push('/'); // Redirige a la homepage
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh' }}>
      <header style={{ background: '#D90429', padding: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/logo.png" alt="Carbnb Logo" style={{ height: '120px', objectFit: 'contain', padding: '8px 24px' }} />
        </Link>
        <Link href="/register">
          <button
            style={{
              marginRight: '32px',
              marginLeft: '16px',
              background: '#bd162c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px', // updated padding
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Registrarse
          </button>
        </Link>
      </header>
      <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#222', padding: 32, borderRadius: 12, width: 400, display: 'flex', flexDirection: 'column', gap: 16, color: '#fff' }}>
          <h2 style={{ textAlign: 'center' }}>Iniciar Sesión</h2>
          <label>Email:</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }} />
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }} />
          <button type="submit" style={{ background: RACING_RED, color: '#fff', padding: 12, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
            Iniciar Sesión
          </button>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'lightgreen', textAlign: 'center' }}>{success}</p>}
          <p style={{ textAlign: 'center' }}>¿No tienes cuenta? <Link href="/register" style={{ color: RACING_RED }}>Regístrate</Link></p>
        </form>
      </main>
    </div>
  );
}
// Elimina cualquier referencia a success y su mensaje