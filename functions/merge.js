// Merge button variables
const mergebtn = document.querySelector("#merge-btn");
const mergeDialog = document.querySelector("#mergeDialogbox");

const mergeInput = document.querySelector("#merge-files");

const submitMerge = document.querySelector("#merge-submit");
const filesContainer = document.querySelector(".total_files");

const uploadMerge = document.querySelector("#uploadfilesmerge");

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
