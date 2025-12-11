interface MultiImageUploadProps {
    values: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    label?: string;
}
declare function MultiImageUpload({ values, onChange, maxImages, label, }: MultiImageUploadProps): import("react/jsx-runtime").JSX.Element;
export default MultiImageUpload;
