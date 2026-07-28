// Split button variables
const splitBtn = document.querySelector("#split-btn");
const splitDialog = document.querySelector("#splitDialogbox");
const splitUploadBtn = document.querySelector("#split-upload-btn");
const splitFileInput = document.querySelector("#split-file");
const splitSubmitBtn = document.querySelector("#split-submit-btn");
const fromInput = document.querySelector("#from");
const toInput = document.querySelector("#to");

// Open split dialog
splitBtn.addEventListener("click", () => {
  splitDialog.showModal();
});

// Trigger file input when upload button is clicked
splitUploadBtn.addEventListener("click", () => {
  splitFileInput.click();
});

// Handle file selection
splitFileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    // Update upload section to show selected file name
    const uploadSection = document.querySelector(".split-file-upload-section");
    const uploadText = uploadSection.querySelector(".upload-text");
    const uploadHint = uploadSection.querySelector(".upload-hint");

    uploadText.textContent = file.name;
    uploadHint.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
  }
});

// Handle split submission
splitSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const file = splitFileInput.files[0];
  const from = parseInt(fromInput.value, 10);
  const to = parseInt(toInput.value, 10);

  if (!file) {
    alert("Please select a PDF file to split.");
    return;
  }

  if (!from || !to || from < 1 || to < 1) {
    alert("Please enter valid page numbers.");
    return;
  }

  if (from > to) {
    alert("'From' page must be less than or equal to 'To' page.");
    return;
  }

  const data = new FormData();
  data.append("file", file);
  data.append("from", from);
  data.append("to", to);

  try {
    splitSubmitBtn.disabled = true;
    splitSubmitBtn.innerHTML =
      '<i class="fa fa-spinner fa-spin" aria-hidden="true"></i> Splitting...';

    const response = await fetch("http://127.0.0.1:8000/splitfile", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Failed to split file");

    const blob = await response.blob();
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "split-document.pdf";
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadURL);
  } catch (error) {
    alert("Server Error connecting to split endpoint");
    console.error(error);
  } finally {
    splitSubmitBtn.disabled = false;
    splitSubmitBtn.innerHTML =
      '<i class="fa fa-scissors" aria-hidden="true"></i> Split PDF';
  }
});
