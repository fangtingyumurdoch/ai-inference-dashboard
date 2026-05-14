import { X } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { Card } from '@/app/ui/card';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadDate: Date;
  width?: number;
  height?: number;
  aiModel: string;
}

interface ImageGalleryProps {
  images: UploadedImage[];
  onDeleteImage: (id: string) => void;
}

export function ImageGallery({ images, onDeleteImage }: ImageGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-4">Uploaded Images ({images.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="relative group overflow-hidden">
            <img
              src={image.preview}
              alt={image.file.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-2">
              <p className="text-xs truncate" title={image.file.name}>
                {image.file.name}
              </p>
              <p className="text-xs text-gray-500">
                {(image.file.size / 1024).toFixed(1)} KB
              </p>
              {image.width && image.height && (
                <p className="text-xs text-gray-500">
                  {image.width} × {image.height}
                </p>
              )}
              <p className="text-xs text-blue-600 font-medium mt-1">
                {image.aiModel}
              </p>
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 size-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onDeleteImage(image.id)}
            >
              <X className="size-4" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}