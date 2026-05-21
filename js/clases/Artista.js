//_____________________________
//_______ CLASE ARTISTA _______

export class Artista {
    // ___________ Propiedades ___________
    id; // → Id
    nick; // → Nick (para login)
    nombre; // → Nombre
    contrasenia; // → Contraseña (para login)
    email; // → Correo electrónico
    especialidad; // → Especialización (ilustración, diseño gráfico, etc)
    imgPerfil; // → nombre de la imagen de perfil
    descripcion; // → Breve descripción
    ubicacion; // → Ciudad/país
    redesSociales; // → Objeto con enlaces a redes sociales (Instagram, Behance, etc)

    // ___________ Constructor ___________

    constructor(id, nick, nombre, contrasenia, email, especialidad, imgPerfil, descripcion, ubicacion, redesSociales) {
        this.id = id;
        this.nick = nick;
        this.nombre = nombre;
        this.contrasenia = contrasenia;
        this.email = email;
        this.especialidad = especialidad;
        this.imgPerfil = imgPerfil;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.redesSociales = redesSociales;
    }

}