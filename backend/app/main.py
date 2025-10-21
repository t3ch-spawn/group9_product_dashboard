from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os
import uvicorn
from routers import products

app = FastAPI()

origins = [
    "http://localhost:5173"
]

# Allow frontend (React) access
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(products.router)

@app.get("/")
def root():
    return {"message": "API is running!"}


# @app.get("/products")
# def get_products():
#     df = pd.read_csv(DATA_PATH)
#     data = df.to_dict(orient="records")
#     print(data)

#     return {"products": data}