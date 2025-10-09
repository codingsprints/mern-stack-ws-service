- docker build -t my-ws-service-prod:latest -f .\docker\production\Dockerfile .

- docker run -it --name ws-service -p 5004:5004 -v "$(pwd)/config:/home/node/app/config" my-ws-service-prod:latest
