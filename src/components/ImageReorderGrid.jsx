import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function ImageReorderGrid({ images, onReorder, onDelete }) {
  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    const reordered = [...images];
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    onReorder(reordered);
  };

  const getImageSrc = (img) => {
    if (typeof img === 'string') return img;
    if (img instanceof File) return URL.createObjectURL(img);
    return '';
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="imagenes" direction="horizontal">
        {(provided) => (
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {images.map((img, index) => (
              <Draggable key={index} draggableId={`img-${index}`} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`relative group rounded shadow overflow-hidden ${
                      snapshot.isDragging ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    <img
                      src={getImageSrc(img)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onDelete(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs px-1 rounded hover:bg-red-700"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

ImageReorderGrid.propTypes = {
  images: PropTypes.array.isRequired, // ahora puede ser string o File
  onReorder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
