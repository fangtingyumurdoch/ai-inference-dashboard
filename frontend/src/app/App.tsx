import { useState, useCallback } from 'react';
import { ImageUpload } from '@/app/components/ImageUpload';
import { PivasResultCard } from './components/ResultDisplay';
import { ImageGallery, type UploadedImage } from '@/app/components/ImageGallery';
import { AnalyticsDashboard } from '@/app/components/AnalyticsDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);

  const handleImageUpload = useCallback((file: File, preview: string, model: string) => {
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      const newImage: UploadedImage = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview,
        uploadDate: new Date(),
        width: img.width,
        height: img.height,
        aiModel: model,
      };
      setImages((prev) => [newImage, ...prev]);
    };
    img.src = preview;
  }, []);

  const handleDeleteImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2">Image Upload & PIVAS Result</h1>  
          <p className="text-gray-600">
            Upload your PIVC image and view the PIVAS result.
          </p>
        </header>

        <Tabs defaultValue="upload" className="space-y-6">
          {/* <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList> */}

          <TabsContent value="upload" className="space-y-6">
            <ImageUpload onImageUpload={handleImageUpload} />
            {images.length > 0 && (
              <div className="mt-8">
                <p className="text-sm text-gray-600 mb-4">
                  Recently uploaded ({images.slice(0, 6).length} of {images.length} shown)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {images.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.preview}
                        alt={image.file.name}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PivasResultCard result="PIVAS1"> 

            </PivasResultCard>
          </TabsContent>

          {/* <TabsContent value="gallery" className="space-y-6">
            {images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No images uploaded yet. Start by uploading some images!</p>
              </div>
            ) : (
              <ImageGallery images={images} onDeleteImage={handleDeleteImage} />
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Upload some images to see analytics!</p>
              </div>
            ) : (
              <AnalyticsDashboard images={images} />
            )}
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}