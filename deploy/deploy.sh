sudo docker buildx create --name abeesdevjs-builder --driver docker-container --bootstrap
sudo docker buildx use abeesdevjs-builder
sudo docker buildx build -t abeesdevjs/social-client:0.0.1 -f Dockerfile --push .
