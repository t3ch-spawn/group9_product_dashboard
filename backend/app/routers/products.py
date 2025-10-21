from fastapi import APIRouter
from services import products_service

router = APIRouter(prefix="/products")

@router.get("/")
def get_products():
    return products_service.get_all_products()

@router.get("/all_metrics")
def get_all_metrics():
    return  products_service.get_all_metrics()

@router.get("/{title}")
def get_product(title):
    return  products_service.get_product(title)
