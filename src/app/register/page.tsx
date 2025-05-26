'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase/firebase'; // Ajusta la ruta a tu firebase config
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';

const RACING_RED = '#D5001F';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'cliente' | 'propietario'>('cliente');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar info adicional en Firestore con serverTimestamp (marca de tiempo oficial de Firebase)
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        role: role,
        createdAt: serverTimestamp(), // Guarda timestamp que Firebase interpreta bien
      });

      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
      setRole('cliente');
    } catch (err: any) {
      // Manejo de errores más amigable
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está registrado. Por favor, usa otro.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Correo inválido.');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil (mínimo 6 caracteres).');
      } else {
        setError(err.message || 'Error al registrar');
      }
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', background: '#111', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ background: '#D90429', padding: 0, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/logo.png" alt="Carbnb Logo" style={{ height: '120px', objectFit: 'contain', padding: '8px 24px' }} />
        </Link>
        <Link href="/login">
          <button
            style={{
              marginRight: '32px',
              marginLeft: '16px',
              background: '#bd162c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Iniciar Sesión
          </button>
        </Link>
      </header>

      <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleRegister} style={{ background: '#222', padding: 32, borderRadius: 12, width: 400, display: 'flex', flexDirection: 'column', gap: 16, color: '#fff' }}>
          <h2 style={{ textAlign: 'center' }}>Crear Cuenta</h2>

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }}
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16 }}
          />

          <label>Tipo de usuario:</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'cliente' | 'propietario')}
            style={{ padding: 10, borderRadius: 8, border: 'none', fontSize: 16, cursor: 'pointer' }}
          >
            <option value="cliente">Cliente</option>
            <option value="propietario">Propietario</option>
          </select>

          <button
            type="submit"
            style={{ background: RACING_RED, color: '#fff', padding: 12, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}
          >
            Registrarse
          </button>

          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          {success && <p style={{ color: 'lightgreen', textAlign: 'center' }}>{success}</p>}

          <p style={{ textAlign: 'center' }}>
            ¿Ya tienes cuenta? <Link href="/login" style={{ color: RACING_RED }}>Inicia sesión</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
