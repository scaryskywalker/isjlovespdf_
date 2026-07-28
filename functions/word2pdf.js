// Word to PDF variables
const word2pdfBtn = document.querySelector("#word2pdf-btn");
const word2pdfDialog = document.querySelector("#word2pdfDialogbox");
const word2pdfUploadBtn = document.querySelector("#word2pdf-upload-btn");
const word2pdfFileInput = document.querySelector("#word2pdf-file");
const word2pdfSubmitBtn = document.querySelector("#word2pdf-submit-btn");

// Open dialog
word2pdfBtn.addEventListener("click", () => {
  word2pdfDialog.showModal();
});

// Trigger file input
word2pdfUploadBtn.addEventListener("click", () => {
  word2pdfFileInput.click();
});

// Handle file selection
word2pdfFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const uploadSection = document.querySelector(
      "#word2pdfDialogbox .split-file-upload-section",
    );
    const uploadText = uploadSection.querySelector(".upload-text");
    const uploadHint = uploadSection.querySelector(".upload-hint");

    uploadText.textContent = file.name;
    uploadHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }
});

// Handle conversion
word2pdfSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const file = word2pdfFileInput.files[0];

  if (!file) {
    alert("Please select a Word document to convert.");
    return;
  }

  const data = new FormData();
  data.append("file", file);

  try {
    word2pdfSubmitBtn.disabled = true;
    word2pdfSubmitBtn.innerHTML =
      '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Converting...';

    const response = await fetch("http://127.0.0.1:8000/word2pdf", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Failed to convert Word to PDF");

    const blob = await response.blob();
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = file.name.replace(/\.(doc|docx)$/i, "") + ".pdf";
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadURL);
  } catch (error) {
    alert("Server Error connecting to word2pdf endpoint");
    console.error(error);
  } finally {
    word2pdfSubmitBtn.disabled = false;
    word2pdfSubmitBtn.innerHTML =
      '<i class="fa fa-exchange" aria-hidden="true"></i> Convert to PDF';
  }
});
