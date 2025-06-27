import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { Download, Upload, X } from 'lucide-react';
import { uploadProductsCSV, getCSVTemplate } from '@/apis/productsService';

export default function UploadCSVModal({ onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!file) return setError('Selecciona un archivo CSV');

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    try {
      const result = await uploadProductsCSV(formData);
      onSuccess(result.data);
      onClose();
    } catch (err) {
      setError('Error al cargar el archivo CSV');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const res = await getCSVTemplate();
      const blob = new Blob([res.data.template], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template_productos.csv';
      link.click();
    } catch (err) {
      console.error('Error descargando template:', err);
    }
  };

  return (
    <Modal title="Carga de CSV" onClose={onClose}>
        <div className="space-y-4">
            <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full border rounded p-2"
            />

            {/* Descargar Template (fila aparte) */}
            <div className="flex flex-col sm:flex-row gap-2 w-full justify-end">
            <Button
                variant="secondary"
                onClick={handleDownloadTemplate}
                className="w-full sm:w-auto"
                icon={Download}
            >
                Descargar Template
            </Button>
            <Button
                onClick={handleUpload}
                loading={isLoading}
                className="w-full sm:w-auto"
                icon={Upload}
            >
                Subir CSV
            </Button>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
    </Modal>

  );
}
