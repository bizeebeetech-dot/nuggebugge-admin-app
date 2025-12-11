interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    label?: string;
    height?: number;
    showPreview?: boolean;
    variant?: 'box' | 'avatar';
}
declare function ImageUpload({ value, onChange, label, height, showPreview, variant, }: ImageUploadProps): import("react/jsx-runtime").JSX.Element;
export default ImageUpload;
