#!/bin/sh
# Get PORT from environment variable, default to 80 if not set
PORT=${PORT:-80}

# Replace PORT_PLACEHOLDER in nginx config template with actual PORT
sed "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"

