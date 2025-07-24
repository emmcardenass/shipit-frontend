import { useEffect, useState } from 'react';
import axios from "@/axios";
import { toast } from 'react-hot-toast';

function AssignDriver({ orderId, onDriverAssigned }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get('/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Error al cargar repartidores:', error);
        toast.error('Error al cargar repartidores');
      }
    };

    fetchDrivers();
  }, []);

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      toast.error('Por favor selecciona un repartidor');
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/orders/assign-driver/${orderId}`, {
        assignedDriver: selectedDriver,
      });
      toast.success('🚚 Repartidor asignado correctamente');
      if (onDriverAssigned) onDriverAssigned();
    } catch (error) {
      console.error('Error al asignar repartidor:', error);
      toast.error('❌ Error al asignar repartidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="assign-driver">
      <select
        value={selectedDriver}
        onChange={(e) => setSelectedDriver(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      >
        <option value="">Selecciona un repartidor</option>
        {drivers.map((driver) => (
          <option key={driver._id} value={driver.nombre}>
            {driver.nombre} {driver.zona ? `- ${driver.zona}` : ''}
          </option>
        ))}
      </select>

      <button
        onClick={handleAssignDriver}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        {loading ? 'Asignando...' : 'Asignar Repartidor'}
      </button>
    </div>
  );
}

export default AssignDriver;
