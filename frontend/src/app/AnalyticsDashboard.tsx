import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { Image, HardDrive, Calendar, FileType } from 'lucide-react';
import type { UploadedImage } from './ImageGallery';

interface AnalyticsDashboardProps {
  images: UploadedImage[];
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function AnalyticsDashboard({ images }: AnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const totalSize = images.reduce((acc, img) => acc + img.file.size, 0);
    const avgSize = images.length > 0 ? totalSize / images.length : 0;

    // File type distribution
    const fileTypes: Record<string, number> = {};
    images.forEach((img) => {
      const ext = img.file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN';
      fileTypes[ext] = (fileTypes[ext] || 0) + 1;
    });

    const fileTypeData = Object.entries(fileTypes).map(([name, value]) => ({
      name,
      value,
    }));

    // Size distribution
    const sizeRanges = [
      { name: '0-100 KB', min: 0, max: 100 * 1024, count: 0 },
      { name: '100-500 KB', min: 100 * 1024, max: 500 * 1024, count: 0 },
      { name: '500KB-1MB', min: 500 * 1024, max: 1024 * 1024, count: 0 },
      { name: '1MB-5MB', min: 1024 * 1024, max: 5 * 1024 * 1024, count: 0 },
      { name: '5MB+', min: 5 * 1024 * 1024, max: Infinity, count: 0 },
    ];

    images.forEach((img) => {
      const range = sizeRanges.find(
        (r) => img.file.size >= r.min && img.file.size < r.max
      );
      if (range) range.count++;
    });

    const sizeData = sizeRanges
      .filter((r) => r.count > 0)
      .map((r) => ({ name: r.name, count: r.count }));

    // Uploads over time (grouped by day)
    const uploadsByDate: Record<string, number> = {};
    images.forEach((img) => {
      const dateKey = img.uploadDate.toLocaleDateString();
      uploadsByDate[dateKey] = (uploadsByDate[dateKey] || 0) + 1;
    });

    const timelineData = Object.entries(uploadsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 days

    // AI Model distribution
    const aiModels: Record<string, number> = {};
    images.forEach((img) => {
      aiModels[img.aiModel] = (aiModels[img.aiModel] || 0) + 1;
    });

    const aiModelData = Object.entries(aiModels).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalCount: images.length,
      totalSize,
      avgSize,
      fileTypeData,
      sizeData,
      timelineData,
      aiModelData,
    };
  }, [images]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4">Analytics Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Images</CardTitle>
            <Image className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{analytics.totalCount}</div>
            <p className="text-xs text-muted-foreground">
              Uploaded images
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Storage</CardTitle>
            <HardDrive className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(analytics.totalSize / (1024 * 1024)).toFixed(2)} MB
            </div>
            <p className="text-xs text-muted-foreground">
              Space used
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Average Size</CardTitle>
            <FileType className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(analytics.avgSize / 1024).toFixed(1)} KB
            </div>
            <p className="text-xs text-muted-foreground">
              Per image
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Recent Uploads</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {analytics.timelineData.length > 0
                ? analytics.timelineData[analytics.timelineData.length - 1].count
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
      </div>

      {images.length > 0 && (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* File Type Distribution */}
            {analytics.fileTypeData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>File Type Distribution</CardTitle>
                  <CardDescription>Breakdown by image format</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.fileTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.fileTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Size Distribution */}
            {analytics.sizeData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Size Distribution</CardTitle>
                  <CardDescription>Images grouped by file size</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.sizeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Upload Timeline */}
            {analytics.timelineData.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upload Timeline</CardTitle>
                  <CardDescription>Daily upload activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.timelineData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* AI Model Distribution */}
            {analytics.aiModelData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Model Distribution</CardTitle>
                  <CardDescription>Breakdown by AI model used</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.aiModelData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics.aiModelData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}