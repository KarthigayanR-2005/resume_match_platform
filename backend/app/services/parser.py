import io
from pypdf import PdfReader
from fastapi import HTTPException, UploadFile

class PDFExtractionService:
    @staticmethod
    async def extract_text_from_upload(file: UploadFile) -> str:
        """
        Reads an uploaded PDF file asynchronously and extracts its raw text content.
        Handles edge cases like empty files or corrupt PDF formatting.
        """
        # Security Guard: Ensure we are only dealing with PDF documents
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400, 
                detail="Unsupported file format. Please upload a valid PDF document."
            )
        
        try:
            # Read raw bytes asynchronously from the file stream directly into memory
            contents = await file.read()
            if len(contents) == 0:
                raise HTTPException(status_code=400, detail="The uploaded PDF file is empty.")
                
            pdf_stream = io.BytesIO(contents)
            reader = PdfReader(pdf_stream)
            
            extracted_text = []
            # Loop through each individual page of the document and extract text characters
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    extracted_text.append(page_text)
            
            # Join all pages together with explicit line breaks
            full_text = "\n".join(extracted_text).strip()
            
            # Validation check: If the PDF was a flat image scan (has no actual text data embedded)
            if not full_text:
                raise HTTPException(
                    status_code=422, 
                    detail="Could not extract text from the PDF. The document might be a flat scanned image lacking an OCR text layer."
                )
                
            return full_text

        except HTTPException as he:
            # Re-raise standard HTTP errors directly so the user sees them
            raise he
        except Exception as e:
            # Print the exact internal error message to your terminal for backend debugging
            print(f"Error during PDF parsing pipeline: {str(e)}")
            raise HTTPException(
                status_code=500, 
                detail="An internal server error occurred while parsing the document."
            )