import { useState, useCallback } from 'react';
import { ImageUpload } from '@/app/ImageUpload';
import { PivasResultCard } from '@/app/ResultDisplay';
import { ImageGallery, type UploadedImage } from '@/app/ImageGallery';
import { AnalyticsDashboard } from '@/app/AnalyticsDashboard';
import { Tabs, TabsContent } from '@/app/ui/tabs';

type PivasResult = 'PIVAS0' | 'PIVAS1' | 'PIVAS2';

export default function App() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [result, setResult] = useState<PivasResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback(
    async (file: File, preview: string, model: string) => {
      const img = new Image();

      img.onload = async () => {
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
        setIsProcessing(true);
        setResult(null);

        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('model_name', model);

          const response = await fetch('http://localhost:8000/predict', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Prediction request failed');
          }

          const data = await response.json();

          setResult(data.prediction);
        } catch (error) {
          console.error(error);
          alert('Prediction failed. Please check your backend service.');
        } finally {
          setIsProcessing(false);
        }
      };

      img.src = preview;
    },
    []
  );

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

            <PivasResultCard result={isProcessing ? 'Processing...' : result ?? 'No result yet'} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}