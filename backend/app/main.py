from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO

from app.inference import predict_image


app = FastAPI(title="Vision Inference Dashboard API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


AVAILABLE_MODELS = [
    "YOLOv8",
    "ResNet18",
    "EfficientNetB0",
    "IRTQ",
]


@app.get("/")
def health_check():
    return {"status": "Backend is running"}


@app.get("/models")
def get_models():
    return {"models": AVAILABLE_MODELS}


@app.post("/predict")
async def predict(
    model_name: str = Form(...),
    image: UploadFile = File(...),
):
    if model_name not in AVAILABLE_MODELS:
        raise HTTPException(status_code=400, detail="Unsupported model selected")

    if image.content_type not in ["image/jpeg", "image/png", "image/webp", "image/gif"]:
        raise HTTPException(status_code=400, detail="Unsupported image type")

    image_bytes = await image.read()

    try:
        pil_image = Image.open(BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    result = predict_image(pil_image, model_name)

    return result