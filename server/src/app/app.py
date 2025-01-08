from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.app.api.routes.root import router as router_root

APP_NAME = "HyperPyText-App"  # You can customize this name
APP_DESCRIPTION = "A FastAPI application created with HyperPyText"
APP_VERSION = "0.1.0"

app = FastAPI(
    title=APP_NAME,
    description=APP_DESCRIPTION,
    version=APP_VERSION
)

# Enable CORS
# This is the vite client dev server default url: "http://localhost:5173"
# Make sure to change the port here if you modify it on the client side
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(router_root)

# You can add more app-wide configurations here, such as:
# app.add_middleware(...)
# app.add_exception_handler(...)
