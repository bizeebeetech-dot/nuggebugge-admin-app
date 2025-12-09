import { Card, CardContent, Typography } from '@mui/material';

interface ExampleComponentProps {
  title: string;
  description?: string;
}

function ExampleComponent({ title, description }: ExampleComponentProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ExampleComponent;

