/**
 * Create FormData for file upload
 */
export function createFormData(files: File | File[], fieldName = 'file'): FormData {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((file) => {
      formData.append(fieldName, file);
    });
  } else {
    formData.append(fieldName, files);
  }

  return formData;
}

/**
 * Create FormData with multiple fields
 */
export function createFormDataWithFields(fields: Record<string, File | File[] | string | number>): FormData {
  const formData = new FormData();

  Object.entries(fields).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (Array.isArray(value) && value[0] instanceof File) {
      value.forEach((file) => {
        formData.append(key, file);
      });
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize;
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
