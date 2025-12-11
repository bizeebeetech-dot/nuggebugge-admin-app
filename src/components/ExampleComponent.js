import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, Typography } from '@mui/material';
function ExampleComponent({ title, description }) {
    return (_jsx(Card, { children: _jsxs(CardContent, { children: [_jsx(Typography, { variant: "h5", component: "div", children: title }), description && (_jsx(Typography, { variant: "body2", color: "text.secondary", children: description }))] }) }));
}
export default ExampleComponent;
