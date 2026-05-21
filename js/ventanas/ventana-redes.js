// ______________________________________________________________
// ____________ VENTANA AUXILIAR - REDES SOCIALES _______________

// ——————————————————————————————————————————————————————————————
//               PARÁMETROS DE LA URL
// ——————————————————————————————————————————————————————————————

// Leemos los valores actuales de las redes que perfil.js nos pasa por la URL
let params = new URLSearchParams(window.location.search);

document.getElementById("inp-instagram").value = params.get("instagram") || "";
document.getElementById("inp-tiktok").value = params.get("tiktok") || "";
document.getElementById("inp-pinterest").value = params.get("pinterest") || "";
document.getElementById("inp-x").value = params.get("x") || "";

// ——————————————————————————————————————————————————————————————
//               GUARDAR REDES SOCIALES
// ——————————————————————————————————————————————————————————————

document.getElementById("vredes-guardar").addEventListener("click", function () {
    let redesSociales = {
        instagram: document.getElementById("inp-instagram").value.trim(),
        tiktok: document.getElementById("inp-tiktok").value.trim(),
        pinterest: document.getElementById("inp-pinterest").value.trim(),
        x: document.getElementById("inp-x").value.trim()
    };

    // Avisamos a la ventana principal para que guarde en el servidor y actualice la vista
    if (window.opener && !window.opener.closed && window.opener.guardarRedes) {
        window.opener.guardarRedes(redesSociales); // → Guardamos en servidor y recargamos el perfil
    }

    window.close();
});


