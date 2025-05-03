# Order Display System Microservice

## Table of Contents
1. [.Net Backend Documentation](#Net-Backend-Documentation)
2. [Table overview of hosts and ports](#Table-overview-of-hosts-and-ports)
3. [A High Level View](#A-High-Level-View)
4. [Docker Detials](#Docker-Detials)
5. [Node Middle Proxy Details](#Node-Middle-Proxy-Details)
6. [Image Upload Details](#Image-Upload-Details)

## .Net Backend Documentation
The documentation for the main application can be found at https://github.com/m-7ard/Dotnet-React-Order-Display-System-

## Setup
### Using Docker
```bash
    >> docker compose up
    >> Go to localhost:80
```

### Manually (Dev mode)
```bash
    # Install dependencies (this assumes you have NodeJS and Python set up)
    >> /frontend npm i
    >> /backend npm i
    >> /fileserver npm i
    >> /auth python -m venv env
    >> /auth env\scripts\activate
    >> /auth pip install -r requirements.txt

    >> dev-start.bat
    >> Go to localhost:5173
```
NOTE: The dev version will not use the Caddy proxy

## Table overview of hosts and ports
| Service          | Dev URL                    | Docker URL                    | Production URL                   |
|------------------|----------------------------|-------------------------------|----------------------------------|
| **Backend Proxy**| `localhost:4200`           | `localhost:3100` (proxy:3100) | `localhost:3100`                 |
| **Caddy**        | None                       | `localhost:80`                | None                             |
| **Auth**         | `localhost:8000`           | `localhost:8000` (auth:8000)  | Same as dev                      |
| **.NET API**     | `localhost:5102`           | `localhost:5000` (web:5000)   | N/A (not set up for prod)        |
| **File Server**  | `localhost:4300`           | `localhost:3000` (auth:3000)  | `localhost:3000`                 |

## A High Level View
![A High Level View](readmeFiles/app-flow-1.png)

## Docker Detials
The application uses a docker compose to orchestrate all the servers and uses a bridge network.
The .Net API is private and only accesible through the docker network, preventing the spoofing of the X-User-Id Header.
There is 1 app-related volume, for the fileserver, used to store media such as uploaded images.

## Node Middle Proxy Details
The Node proxy will receive all requests to the .Net & Logout requests. (Except when logging out) It will always first try to confirm that the user is authenticated, by first looking through the token cache in Redis, and then look at the remote Auth server and try to obtain the token from there (which includes the user id), and then cache it in the Redis cache with a TTL dicated by the expiry date of the token. If both the lookups fail, a 401 status is returned.

## Image Upload Details
Image upload go through the proxy, which will then forward the request to the file server, which when successful in saving the images, will return a response with the urls and generated filenames for the saved images and then send a request over to the .Net server to persist "Draft Images" that will be used as a sort of "available image" pool at the time of product image creation.
