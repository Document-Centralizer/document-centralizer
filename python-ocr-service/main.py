from fastapi import FastAPI, UploadFile, File, HTTPException
import pytesseract
from PIL import Image
import io

# Explicitly set the tesseract executable path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = FastAPI(title="Python OCR Service", description="Service for extracting text from images using Tesseract OCR")

@app.get("/")
def read_root():
    return {"status": "OCR Service is running"}

@app.post("/extract")
async def extract_text(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        
        text = ""
        # Check if PDF by looking for magic bytes
        if contents.startswith(b'%PDF'):
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(contents))
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        else:
            image = Image.open(io.BytesIO(contents))
            # Extract text using pytesseract
            text = pytesseract.image_to_string(image)
        
        return {
            "filename": file.filename,
            "extracted_text": text.strip()
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
