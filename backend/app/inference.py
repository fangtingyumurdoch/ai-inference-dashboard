import random
from PIL import Image

# TODO: Update this part
VALID_RESULTS = ["PIVAS0", "PIVAS1", "PIVAS2"]


def predict_image(image: Image.Image, model_name: str) -> dict:
    """
    Mock inference function.
    Replace this function with real model inference later.
    """

    prediction = random.choice(VALID_RESULTS)
    confidence = round(random.uniform(0.75, 0.98), 2)

    return {
        "model": model_name,
        "prediction": prediction,
        "confidence": confidence,
    }