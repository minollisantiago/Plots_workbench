import argparse
from src.app import app
from os import environ as env
from dotenv import load_dotenv
from uvicorn import run as uvicorn_run

load_dotenv()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the server")
    parser.add_argument("--reload", action="store_true", help="Enable reload")
    args = parser.parse_args()
    host = env.get("SERVER_HOST")
    port = env.get("SERVER_PORT")

    if not host or not port:
        raise ValueError("SERVER_HOST and SERVER_PORT must be set in the .env file or environment")

    if args.reload:
        uvicorn_run("src.app:app", host=host, port=int(port), reload=args.reload)
    else:
        uvicorn_run(app, host=host, port=int(port), reload=args.reload)
