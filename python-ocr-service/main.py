from fastapi import FastAPI, UploadFile, File, HTTPException
import pytesseract
from PIL import Image
import io

app = FastAPI(title="Python OCR Service", description="Service for extracting text from images using Tesseract OCR")

@app.get("/")
def read_root():
    return {"status": "OCR Service is running"}

@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Extract text using pytesseract
        text = pytesseract.image_to_string(image)
        
        return {
            "filename": file.filename,
            "extracted_text": text.strip()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
