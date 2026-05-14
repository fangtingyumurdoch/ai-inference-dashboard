import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Label } from '@/app/components/ui/label';

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string, model: string) => void;
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4-vision');

  const aiModels = [
    { value: 'YOLOv8', label: 'YOLOv8' },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          onImageUpload(file, preview, selectedModel);
        };
        reader.readAsDataURL(file);
      }
    });
  }, [onImageUpload, selectedModel]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <Label htmlFor="ai-model">Select AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="ai-model">
              <SelectValue placeholder="Choose an AI model" />
            </SelectTrigger>
            <SelectContent>
              {aiModels.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Selected model will be used to process uploaded images
          </p>
        </div>
      </Card>

      <Card
        className={`p-8 border-2 border-dashed transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Upload className={`size-8 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="mb-2">
              Drag and drop images here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF, WebP
            </p>
          </div>
          <Button asChild>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileInput}
              />
              Browse Files
            </label>
          </Button>
        </div>
      </Card>
    </div>
  );
}