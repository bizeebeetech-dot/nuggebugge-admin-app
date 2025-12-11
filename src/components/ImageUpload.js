import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, IconButton, Avatar, } from '@mui/material';
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material';
import websiteService from '../services/website.service';
function ImageUpload({ value, onChange, label = 'Upload Image', height = 150, showPreview = true, variant = 'box', }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileSelect = async (event) => {
        const file = event.target.files?.[0];
        if (!file)
            return;
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
        }
        catch (err) {
            setError('Failed to upload image');
            console.error('Upload error:', err);
        }
        finally {
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
        return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }, children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileSelect, ref: fileInputRef, style: { display: 'none' } }), _jsx(Avatar, { src: value, sx: {
                        width: 100,
                        height: 100,
                        cursor: 'pointer',
                        border: '2px dashed',
                        borderColor: value ? 'transparent' : 'grey.400',
                        '&:hover': { opacity: 0.8 },
                    }, onClick: handleClick, children: uploading ? _jsx(CircularProgress, { size: 30 }) : _jsx(ImageIcon, {}) }), _jsxs(Box, { sx: { display: 'flex', gap: 1 }, children: [_jsx(Button, { size: "small", startIcon: _jsx(CloudUpload, {}), onClick: handleClick, disabled: uploading, children: value ? 'Change' : 'Upload' }), value && (_jsx(IconButton, { size: "small", color: "error", onClick: handleRemove, children: _jsx(Delete, {}) }))] }), error && _jsx(Typography, { color: "error", variant: "caption", children: error })] }));
    }
    return (_jsxs(Box, { sx: { width: '100%' }, children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleFileSelect, ref: fileInputRef, style: { display: 'none' } }), showPreview && value ? (_jsxs(Box, { sx: { position: 'relative', mb: 1 }, children: [_jsx(Box, { sx: {
                            height,
                            borderRadius: 1,
                            overflow: 'hidden',
                            backgroundImage: `url(${value})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: '1px solid',
                            borderColor: 'grey.300',
                        } }), _jsxs(Box, { sx: {
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 1,
                        }, children: [_jsx(Button, { size: "small", variant: "contained", startIcon: _jsx(CloudUpload, {}), onClick: handleClick, disabled: uploading, children: "Change" }), _jsx(IconButton, { size: "small", sx: { bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }, onClick: handleRemove, children: _jsx(Delete, {}) })] })] })) : (_jsx(Box, { onClick: handleClick, sx: {
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
                }, children: uploading ? (_jsx(CircularProgress, {})) : (_jsxs(_Fragment, { children: [_jsx(CloudUpload, { sx: { fontSize: 40, color: 'grey.500', mb: 1 } }), _jsx(Typography, { color: "text.secondary", children: label }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Click to upload (Max 10MB)" })] })) })), error && (_jsx(Typography, { color: "error", variant: "caption", sx: { mt: 0.5, display: 'block' }, children: error }))] }));
}
export default ImageUpload;
