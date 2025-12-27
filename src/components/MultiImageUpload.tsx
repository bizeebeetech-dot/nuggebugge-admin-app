import { useState, useRef } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import websiteService from '../services/website.service';
import { getImageUrl } from '../utils/imageUrl';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  label?: string;
}

function MultiImageUpload({
  values = [],
  onChange,
  maxImages = 10,
  label = 'Upload Images',
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check max images
    if (values.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Each file must be less than 10MB');
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      const responses = await websiteService.uploadMultipleFiles(files);
      const newUrls = responses.map((r) => r.url);
      onChange([...values, ...newUrls]);
    } catch (err) {
      setError('Failed to upload images');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label} ({values.length}/{maxImages})
      </Typography>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />

      <Grid container spacing={2}>
        {values.map((url, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box
              sx={{
                position: 'relative',
                paddingTop: '100%',
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'grey.300',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `url(${getImageUrl(url)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <IconButton
                size="small"
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
                onClick={() => handleRemove(index)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}

        {values.length < maxImages && (
          <Grid item xs={6} sm={4} md={3}>
            <Box
              onClick={handleClick}
              sx={{
                paddingTop: '100%',
                position: 'relative',
                borderRadius: 1,
                border: '2px dashed',
                borderColor: error ? 'error.main' : 'grey.400',
                cursor: 'pointer',
                bgcolor: 'grey.50',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'grey.100',
                },
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {uploading ? (
                  <CircularProgress size={30} />
                ) : (
                  <>
                    <Add sx={{ fontSize: 30, color: 'grey.500' }} />
                    <Typography variant="caption" color="text.secondary">
                      Add Photos
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        )}
      </Grid>

      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default MultiImageUpload;

