import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { Box, Typography, CircularProgress, IconButton, Grid, } from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import websiteService from '../services/website.service';
function MultiImageUpload({ values = [], onChange, maxImages = 10, label = 'Upload Images', }) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const handleFileSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0)
            return;
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
        }
        catch (err) {
            setError('Failed to upload images');
            console.error('Upload error:', err);
        }
        finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    const handleRemove = (index) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
    };
    const handleClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs(Box, { sx: { width: '100%' }, children: [_jsxs(Typography, { variant: "subtitle2", sx: { mb: 1 }, children: [label, " (", values.length, "/", maxImages, ")"] }), _jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handleFileSelect, ref: fileInputRef, style: { display: 'none' } }), _jsxs(Grid, { container: true, spacing: 2, children: [values.map((url, index) => (_jsx(Grid, { item: true, xs: 6, sm: 4, md: 3, children: _jsxs(Box, { sx: {
                                position: 'relative',
                                paddingTop: '100%',
                                borderRadius: 1,
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'grey.300',
                            }, children: [_jsx(Box, { sx: {
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundImage: `url(${url})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    } }), _jsx(IconButton, { size: "small", sx: {
                                        position: 'absolute',
                                        top: 4,
                                        right: 4,
                                        bgcolor: 'error.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'error.dark' },
                                    }, onClick: () => handleRemove(index), children: _jsx(Delete, { fontSize: "small" }) })] }) }, index))), values.length < maxImages && (_jsx(Grid, { item: true, xs: 6, sm: 4, md: 3, children: _jsx(Box, { onClick: handleClick, sx: {
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
                            }, children: _jsx(Box, { sx: {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }, children: uploading ? (_jsx(CircularProgress, { size: 30 })) : (_jsxs(_Fragment, { children: [_jsx(Add, { sx: { fontSize: 30, color: 'grey.500' } }), _jsx(Typography, { variant: "caption", color: "text.secondary", children: "Add Photos" })] })) }) }) }))] }), error && (_jsx(Typography, { color: "error", variant: "caption", sx: { mt: 1, display: 'block' }, children: error }))] }));
}
export default MultiImageUpload;
