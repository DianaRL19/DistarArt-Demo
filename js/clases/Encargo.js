//_____________________________
//_______ CLASE ENCARGO _______

export class Encargo {
    // ___________ Propiedades ___________
    id;
    nombre;
    descripcion;
    id_cliente;
    id_artista;
    precio;
    fechaEntrega;
    estado; // → "En proceso", "Finalizado", "Cancelado"
    fase; // → Número del 1 al 8 que representa la fase actual del encargo
    imagenes;
    nombre_cliente;
    email_cliente;
    direccion_cliente;
    pais_cliente;
    presupuesto_cliente;
    borrado;

    // ___________ Constructor ___________

    constructor(id, nombre, descripcion, id_cliente, id_artista, precio, fechaEntrega, estado, fase, imagenes, nombre_cliente, email_cliente, direccion_cliente, pais_cliente, presupuesto_cliente, borrado) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.id_cliente = id_cliente;
        this.id_artista = id_artista;
        this.precio = precio;
        this.fechaEntrega = fechaEntrega;
        this.estado = estado;
        this.fase = fase;
        this.imagenes = imagenes;
        this.nombre_cliente = nombre_cliente || "";
        this.email_cliente = email_cliente || "";
        this.direccion_cliente = direccion_cliente || "";
        this.pais_cliente = pais_cliente || "";
        this.presupuesto_cliente = presupuesto_cliente || 0;
        this.borrado = borrado || false;
    }

    cambiarFase(nuevaFase) {
        this.fase = nuevaFase;
    }

    cambiarEstado(nuevoEstado) {
        this.estado = nuevoEstado;
    }
}