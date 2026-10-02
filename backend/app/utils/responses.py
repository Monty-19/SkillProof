from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(data: Any = None, message: str = "Success", status_code: int = 200) -> JSONResponse:
    content = {
        "success": True,
        "message": message,
        "data": data
    }
    return JSONResponse(status_code=status_code, content=content)

def error_response(message: str = "An error occurred", status_code: int = 400, details: Optional[Any] = None) -> JSONResponse:
    content = {
        "success": False,
        "message": message,
        "details": details
    }
    return JSONResponse(status_code=status_code, content=content)
