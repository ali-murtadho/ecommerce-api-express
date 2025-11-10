1. docker build -t express/ecommerce:1.0.0 . 
2. docker images
3. docker run -d -p 3000:3000 express/ecommerce:1.0.0
4. docker run -d -p 3000:3000 (-p untuk port)

# stop container
5. docker container stop {{ nama }}

# delete container
docker container prune (delete semua container yang stop)
docker rm <container_id>

# delete image
docker rmi <image_id>
