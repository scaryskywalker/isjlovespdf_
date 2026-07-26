// Merge button variables
const mergebtn = document.querySelector("#merge-btn");
const mergeDialog = document.querySelector("#mergeDialogbox");

const mergeInput = document.querySelector("#merge-files");

const submitMerge = document.querySelector("#merge-submit");
const filesContainer = document.querySelector(".total_files");
const formData = document.querySelector("#mergeform");
const uploadMerge = document.querySelector("#uploadfilesmerge");

// Api checking

mergebtn.addEventListener("click", () => {
  mergeDialog.showModal();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mergeDialog.classList.add("is-visible");
    });
  });
});

uploadMerge.addEventListener("click", () => {
  mergeInput.click();
});

mergeInput.addEventListener("change", (event) => {
  event.preventDefault();

  const files = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const box = document.createElement("button");

    box.className = "files";
    box.innerHTML = `<i class="fa fa-file" aria-hidden="true"></i>`;
    box.dataset.index = i;
    filesContainer.appendChild(box);
  }
});

filesContainer.addEventListener("click", (e) => {
  const clicked = e.target.closest(".files");

  if (clicked) {
    const removeIndex = parseInt(clicked.dataset.index, 10);

    const dt = new DataTransfer();

    const currentFile = mergeInput.files;

    for (let i = 0; i < currentFile.length; i++) {
      if (i !== removeIndex) {
        dt.items.add(currentFile[i]);
      }
    }

    mergeInput.files = dt.files;

    clicked.remove();

    // resyncing the remaining boxes
    const remainingBoxes = filesContainer.querySelectorAll(".files");
    remainingBoxes.forEach((box, index) => {
      box.dataset.index = index;
    });
  }
});

submitMerge.addEventListener("click", async (e) => {
  e.preventDefault();

  const data = new FormData();

  const files = mergeInput.files;
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/mergefiles", {
      method: "POST",
      body: data,
    });

    if (!response.ok) throw new Error("Failed to merge Files");

    const blob = await response.blob();
    const downloadURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadURL;
    link.download = "merged-document.pdf";
    link.click();
    link.remove();
  } catch (error) {
    alert("Server Error connecting to mergefiles");
  }
});
