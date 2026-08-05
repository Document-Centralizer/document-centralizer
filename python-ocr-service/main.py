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
def extract_text(file: UploadFile = File(...)):
    try:
        contents = file.file.read()
        
        text = ""
        confidence_score = 100.0
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
            # Extract text and confidence using pytesseract
            data = pytesseract.image_to_data(image, output_type=pytesseract.Output.DICT)
            words = []
            confidences = []
            for i in range(len(data['text'])):
                word = data['text'][i].strip()
                conf = float(data['conf'][i])
                if word:
                    words.append(word)
                if conf >= 0:
                    confidences.append(conf)
            
            text = " ".join(words)
            if confidences:
                confidence_score = sum(confidences) / len(confidences)
            else:
                confidence_score = 0.0
        
        return {
            "filename": file.filename,
            "extracted_text": text.strip(),
            "confidence_score": round(confidence_score, 2)
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")
