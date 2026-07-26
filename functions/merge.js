// Merge button variables
const mergebtn = document.querySelector("#merge-btn");
const mergeDialog = document.querySelector("#mergeDialogbox");
const mergeInput = document.querySelector("#merge-files");
const submitMerge = document.querySelector("#merge-submit");

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
