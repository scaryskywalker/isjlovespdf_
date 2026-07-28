from fastapi import FastAPI, File, UploadFile, Response, Form
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import fitz
from pdf2docx import Converter

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

@app.post("/splitfile")
async def split(file: UploadFile = File(...), from_page: int = Form(alias="from"), to_page: int = Form(alias="to")):
    try:
        file_bytes = await file.read()

        with fitz.open(stream=file_bytes, filetype="pdf") as src_pdf:
            total_pages = len(src_pdf)

            # Validate page range (1-indexed from user, 0-indexed in PyMuPDF)
            if from_page < 1 or to_page > total_pages or from_page > to_page:
                return Response(
                    content=f"Invalid page range. PDF has {total_pages} pages. Requested: {from_page}-{to_page}",
                    status_code=400,
                )

            split_pdf = fitz.open()
            split_pdf.insert_pdf(src_pdf, from_page=from_page - 1, to_page=to_page - 1)

            pdf_bytes = split_pdf.tobytes(garbage=4, deflate=True)
            split_pdf.close()

        await file.close()

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=split_pages_{from_page}-{to_page}.pdf"
            }
        )

    except Exception as e:
        return Response(
            content=f"Error splitting PDF: {str(e)}",
            status_code=500,
        )


@app.post("/pdf2word")
async def pdf2word():
    pass