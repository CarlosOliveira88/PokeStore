// https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", () => {
  console.log("PokeStore JS imported successfully!");
});

function changeImageOnResize() {
  const img = document.getElementById("indexPokemons");
  const windowWidth = window.innerWidth;

  if (windowWidth < 800) {
    img.src = "/images/grupoEevees.png";
  } else {
    img.src = "/images/NicePng_pokemon-png-images_622961.png";
  }
}

changeImageOnResize();

// Llamar a la función cada vez que la ventana cambie de tamaño
window.addEventListener("resize", changeImageOnResize);