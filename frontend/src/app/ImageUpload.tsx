import { useCallback, useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { Card } from '@/app/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/ui/select';
import { Label } from '@/app/ui/label';

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string, model: string) => void;
}

const API_BASE_URL = 'http://localhost:8000';

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [aiModels, setAiModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch(`${API_BASE_URL}/models`);

        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }

        const data = await response.json();
        setAiModels(data.models);

        if (data.models.length > 0) {
          setSelectedModel(data.models[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingModels(false);
      }
    }

    fetchModels();
  }, []);

  const processFiles = useCallback(
    (files: FileList | null) => {
      if (!files || !selectedModel) return;

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();

        reader.onload = (event) => {
          const preview = event.target?.result;

          if (typeof preview !== 'string') return;

          onImageUpload(file, preview, selectedModel);
        };

        reader.readAsDataURL(file);
      });
    },
    [onImageUpload, selectedModel]
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      processFiles(event.dataTransfer.files);
    },
    [processFiles]
  );

  const handleFileInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      processFiles(event.target.files);
      event.target.value = '';
    },
    [processFiles]
  );

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white">
        <div className="space-y-4">
          <Label htmlFor="ai-model">Select AI Model</Label>

          <Select
            value={selectedModel}
            onValueChange={setSelectedModel}
            disabled={isLoadingModels || aiModels.length === 0}
          >
            <SelectTrigger id="ai-model">
              <SelectValue
                placeholder={
                  isLoadingModels ? 'Loading models...' : 'Choose an AI model'
                }
              />
            </SelectTrigger>

            <SelectContent>
              {aiModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
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

          <Button asChild disabled={!selectedModel}>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,.gif,.webp"
                multiple
                disabled={!selectedModel}
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