FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default nginx files
RUN rm -rf ./*

# Copy application files
COPY Dominoes.html ./index.html
COPY Dominoes.css ./Dominoes.css
COPY Dominoes.js ./Dominoes.js

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a custom nginx.conf to use /tmp for cache
RUN echo 'user nginx;' > /etc/nginx/nginx.conf && \
    echo 'worker_processes auto;' >> /etc/nginx/nginx.conf && \
    echo 'error_log /var/log/nginx/error.log notice;' >> /etc/nginx/nginx.conf && \
    echo 'pid /tmp/nginx.pid;' >> /etc/nginx/nginx.conf && \
    echo 'events { worker_connections 1024; }' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    client_body_temp_path /tmp/client_temp;' >> /etc/nginx/nginx.conf && \
    echo '    proxy_temp_path /tmp/proxy_temp;' >> /etc/nginx/nginx.conf && \
    echo '    fastcgi_temp_path /tmp/fastcgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    uwsgi_temp_path /tmp/uwsgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    scgi_temp_path /tmp/scgi_temp;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    sendfile on;' >> /etc/nginx/nginx.conf && \
    echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]