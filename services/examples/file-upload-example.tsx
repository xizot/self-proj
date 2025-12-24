'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from 'shared-ui';
import { userService } from '../user-service';
import { createFormData, formatFileSize, validateFileSize, validateFileType } from '@/utils';
import { formatApiError } from '@/utils';

/**
 * Example component demonstrating file upload
 */
export function FileUploadExample() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (!validateFileType(selectedFile, ALLOWED_TYPES)) {
      setError(`File type not allowed. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
      return;
    }

    // Validate file size
    if (!validateFileSize(selectedFile, MAX_SIZE)) {
      setError(`File too large. Maximum size: ${formatFileSize(MAX_SIZE)}`);
      return;
    }

    setFile(selectedFile);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError(null);

      // Method 1: Using service method (recommended)
      const updatedUser = await userService.uploadAvatar('123', file);
      console.log('Avatar uploaded:', updatedUser);

      // Method 2: Using apiClient directly with FormData helper
      // import { apiClient } from '@/libs';
      // import { createFormData } from '@/utils';
      // const formData = createFormData(file, 'avatar');
      // const response = await apiClient.post<User>('/users/123/avatar', formData);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadMultiple = async (files: File[]) => {
    try {
      setUploading(true);
      setError(null);

      // Upload multiple files
      const formData = createFormData(files, 'files');
      // Add other fields if needed
      formData.append('userId', '123');
      formData.append('description', 'Multiple files upload');

      // Use apiClient directly
      // const response = await apiClient.post('/upload/multiple', formData);
    } catch (err) {
      const errorMessage = formatApiError(err);
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Upload Example</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Input */}
        <div>
          <input
            type="file"
            accept={ALLOWED_TYPES.join(',')}
            onChange={handleFileChange}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
          />
          {file && (
            <div className="mt-2 text-sm text-muted-foreground">
              Selected: {file.name} ({formatFileSize(file.size)})
            </div>
          )}
        </div>

        {/* Preview */}
        {preview && (
          <div>
            <img src={preview} alt="Preview" className="max-h-48 rounded-lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        {/* Upload Button */}
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? 'Uploading...' : 'Upload Avatar'}
        </Button>
      </CardContent>
    </Card>
  );
}
