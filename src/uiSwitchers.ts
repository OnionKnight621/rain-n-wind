const hint = document.getElementById("hint") as HTMLDivElement;
const sExpand = document.getElementById("s-expand") as HTMLDivElement;
const sCollapse = document.getElementById("s-collapse") as HTMLDivElement;
const settings = document.getElementById("settings") as HTMLDivElement;

hint.addEventListener("click", function () {
  this.style.display = "none";
});

sExpand.addEventListener("click", function () {
  settings.style.display = "initial";
  sExpand.style.display = "none";
});

sCollapse.addEventListener("click", function () {
  settings.style.display = "none";
  sExpand.style.display = "initial";
});

export {};
