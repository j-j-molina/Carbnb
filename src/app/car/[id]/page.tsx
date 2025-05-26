"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);  // Guarda info usuario
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Cargar datos del carro
  useEffect(() => {
    if (!id) return;
    const fetchCar = async () => {
      const docRef = doc(db, "carros", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar(docSnap.data());
      } else {
        setCar(undefined);
      }
      setLoading(false);
    };
    fetchCar();
  }, [id]);

  // Detectar usuario autenticado y guardar user
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Función para reservar
  const handleReservation = async () => {
    if (!startDate || !endDate) {
      setMessage("Por favor selecciona las fechas de inicio y fin.");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setMessage("La fecha de inicio debe ser menor o igual a la fecha de fin.");
      return;
    }
    try {
      const reservationData = {
        userId: user.uid,
        carId: id,
        startDate,
        endDate,
        carModelo: car.modelo,
        carMarca: car.marca,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "reservas"), reservationData);
      setMessage("Reserva realizada con éxito.");
      // Redirigir a página de reservas después de 1.5 seg
      setTimeout(() => {
        router.push("/reservations");
      }, 1500);
    } catch (error) {
      setMessage("Error al realizar la reserva: " + error.message);
    }
  };

  if (loading) return <div style={{ color: '#fff', background: '#330000', minHeight: '100vh' }}>Cargando...</div>;
  if (car === undefined) return <div style={{ color: '#fff', background: '#330000', minHeight: '100vh' }}>Auto no encontrado</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#330000", padding: 0 }}>
      <header style={{ background: '#d5001c', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 40px' }}>
        <a href="/">
          <img src="/logo.png" alt="Carbnb Logo" style={{ height: '120px', display: 'block' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingRight: 32 }}>
          {!isAuthenticated ? (
            <>
              <button onClick={() => router.push('/login')} style={{ background: '#bd162c', border: 'none', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8, borderRadius: 6, padding: '6px 18px' }}>Iniciar sesión</button>
              <button onClick={() => router.push('/register')} style={{ background: '#bd162c', border: 'none', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', borderRadius: 6, padding: '6px 18px' }}>Registrarse</button>
            </>
          ) : (
            <>
              <button onClick={() => router.push('/reservations')} style={{ background: '#bd162c', border: 'none', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer', marginRight: 8, borderRadius: 6, padding: '6px 18px' }}>Mis Reservaciones</button>
              <button onClick={() => { getAuth().signOut(); router.push('/'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <img src="/shutdown.png" alt="Cerrar sesión" style={{ height: 28, width: 28 }} />
              </button>
            </>
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
          overflow: "hidden"
        }}>
          {/* Left info section */}
          <div style={{ flex: 1.1, padding: "36px 32px 36px 36px", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 32, marginBottom: 8, color: "#fff" }}>{car.modelo} <span style={{ color: "#bbb" }}>({car.marca})</span></h1>
              <div style={{ marginBottom: 18 }}>
                <div><b>Año:</b> <span style={{ color: "#fff" }}>{car.año}</span></div>
                <div><b>Carrocería:</b> <span style={{ color: "#fff" }}>{car.carroceria}</span></div>
                <div><b>Combustible:</b> <span style={{ color: "#fff" }}>{car.combustible}</span></div>
                <div><b>Pasajeros:</b> <span style={{ color: "#fff" }}>{car.pasajeros}</span></div>
                <div><b>Puertas:</b> <span style={{ color: "#fff" }}>{car.puertas}</span></div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <b>Descripción:</b>
                <div style={{ color: "#fff", fontSize: 15, marginTop: 4 }}>
                  {car.descripcion || "Sin descripción disponible."}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <b>Selecciona fechas:</b>
                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: "#222", color: "#fff", border: "1px solid #555", borderRadius: 4, padding: 4 }} />
                  <span style={{ alignSelf: "center", color: "#fff" }}>→</span>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: "#222", color: "#fff", border: "1px solid #555", borderRadius: 4, padding: 4 }} />
                </div>
              </div>
              {isAuthenticated && (
                <button
                  onClick={handleReservation}
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 28px",
                    fontWeight: 600,
                    fontSize: 18,
                    cursor: "pointer",
                    marginTop: 8,
                    boxShadow: "0 2px 8px #0005"
                  }}
                >
                  Hacer Reserva
                </button>
              )}
              {message && (
                <div style={{ marginTop: 12, color: message.includes("éxito") ? "lightgreen" : "yellow", fontWeight: 600 }}>
                  {message}
                </div>
              )}
            </div>
          </div>
          {/* Right image section */}
          <div style={{ flex: 1, background: "#1a0a0e", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
            <img src={car.foto || car.imagen} alt={car.modelo} style={{ width: 340, borderRadius: 16, boxShadow: "0 4px 24px #0008", margin: 0 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
