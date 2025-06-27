import { useState } from 'react';
import InternalUserForm from '@/components/InternalUserForm';
import SuccessModal from '@/components/SuccessModal';

export default function RegisterInternalUsersPage() {
  const [showModal, setShowModal] = useState(false);

  const handleUserCreated = () => {
    setShowModal(true);
    setTimeout(() => window.location.reload(), 2000); // recarga después del éxito
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Registro de Usuarios Internos
      </h1>

      {/* Formulario embebido (ya no es modal) */}
      <InternalUserForm onSuccess={handleUserCreated} />

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        successMessage="¡Usuario creado correctamente!"
        redirectTo="/usuarios"
      />
    </div>
  );
}
