from fastapi import APIRouter, HTTPException, Request

router = APIRouter()

@router.get("/", response_model=dict[str, str])
async def root(request: Request):
    try:
        response_ = {"message": "Hello From the Server!"}
        return response_
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
