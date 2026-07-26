from fastapi import FastAPI, File, UploadFile, Response
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import fitz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
async def root():
    return {"message" : "This is the homepage"}


@app.post('/mergefiles')
async def merge(files: List[UploadFile] = File(...) ):
    merged_pdf = fitz.open()

    try:
        for file in files:
            file_bytes = await file.read()

            with fitz.open(stream=file_bytes, filetype="pdf") as src_pdf:
                merged_pdf.insert_pdf(src_pdf)

            await file.close()

        pdf_bytes = merged_pdf.tobytes(garbage=4, deflate=True)

    finally:
        merged_pdf.close()

    return Response (
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=merged_document.pdf"
        }
    )


