import { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Avatar,
} from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import websiteService from '../services/website.service';
import { getImageUrl } from '../utils/imageUrl';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  height?: number;
  showPreview?: boolean;
  variant?: 'box' | 'avatar';
}

function ImageUpload({
  value,
  onChange,
  label = 'Upload Image',
  height = 150,
  showPreview = true,
  variant = 'box',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const response = await websiteService.uploadFile(file);
      onChange(response.url);
    } catch (err) {
      setError('Failed to upload image');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (variant === 'avatar') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <Avatar
          src={value}
          sx={{
            width: 100,
            height: 100,
            cursor: 'pointer',
            border: '2px dashed',
            borderColor: value ? 'transparent' : 'grey.400',
            '&:hover': { opacity: 0.8 },
          }}
          onClick={handleClick}
        >
          {uploading ? <CircularProgress size={30} /> : <ImageIcon />}
        </Avatar>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" startIcon={<CloudUpload />} onClick={handleClick} disabled={uploading}>
            {value ? 'Change' : 'Upload'}
          </Button>
          {value && (
            <IconButton size="small" color="error" onClick={handleRemove}>
              <Delete />
            </IconButton>
          )}
        </Box>
        {error && <Typography color="error" variant="caption">{error}</Typography>}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      {showPreview && value ? (
        <Box sx={{ position: 'relative', mb: 1 }}>
          <Box
            sx={{
              height,
              borderRadius: 1,
              overflow: 'hidden',
              backgroundImage: `url(${getImageUrl(value)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid',
              borderColor: 'grey.300',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            <Button
              size="small"
              variant="contained"
              startIcon={<CloudUpload />}
              onClick={handleClick}
              disabled={uploading}
            >
              Change
            </Button>
            <IconButton
              size="small"
              sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
              onClick={handleRemove}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={handleClick}
          sx={{
            height,
            borderRadius: 1,
            border: '2px dashed',
            borderColor: error ? 'error.main' : 'grey.400',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            bgcolor: 'grey.50',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'grey.100',
            },
          }}
        >
          {uploading ? (
            <CircularProgress />
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 40, color: 'grey.500', mb: 1 }} />
              <Typography color="text.secondary">{label}</Typography>
              <Typography variant="caption" color="text.secondary">
                Click to upload (Max 10MB)
              </Typography>
            </>
          )}
        </Box>
      )}

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default ImageUpload;

