// PDF to Word variables
const pdf2wordBtn = document.querySelector("#pdf2word-btn");
const pdf2wordDialog = document.querySelector("#pdf2wordDialogbox");
const pdf2wordUploadBtn = document.querySelector("#pdf2word-upload-btn");
const pdf2wordFileInput = document.querySelector("#pdf2word-file");
const pdf2wordSubmitBtn = document.querySelector("#pdf2word-submit-btn");

// Open dialog
pdf2wordBtn.addEventListener("click", () => {
  pdf2wordDialog.showModal();
});

// Trigger file input
pdf2wordUploadBtn.addEventListener("click", () => {
  pdf2wordFileInput.click();
});

// Handle file selection
pdf2wordFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const uploadSection = document.querySelector(
      "#pdf2wordDialogbox .split-file-upload-section",
    );
    const uploadText = uploadSection.querySelector(".upload-text");
    const uploadHint = uploadSection.querySelector(".upload-hint");

    uploadText.textContent = file.name;
    uploadHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }
});

// Handle conversion
pdf2wordSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const file = pdf2wordFileInput.files[0];

  if (!file) {
    alert("Please select a PDF file to convert.");
    return;
  }

  const data = new FormData();
  data.append("file", file);

  try {
    pdf2wordSubmitBtn.disabled = true;
    pdf2wordSubmitBtn.innerHTML =
      '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Converting...';

    const response = await fetch("http://127.0.0.1:8000/pdf2word", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Failed to convert PDF to Word");

    const blob = await response.blob();
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = file.name.replace(/\.pdf$/i, "") + ".docx";
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadURL);
  } catch (error) {
    alert("Server Error connecting to pdf2word endpoint");
    console.error(error);
  } finally {
    pdf2wordSubmitBtn.disabled = false;
    pdf2wordSubmitBtn.innerHTML =
      '<i class="fa fa-exchange" aria-hidden="true"></i> Convert to Word';
  }
});
