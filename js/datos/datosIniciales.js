// ______________________________________________________________
// _________________ DATOS INICIALES DE LA APP _________________
//
// Aquí están los datos de artistas, encargos y logros que antes
// se cargaban desde los JSON del servidor.
// Ahora viven directamente en este archivo como arrays de objetos.

// _____________ ARTISTAS _____________

export const artistas = [
    {
        id: 1,
        nick: "diwin_art",
        nombre: "Diana Romero",
        contrasenia: "2daw",
        email: "diwin.art@gmail.com",
        especialidad: "Ilustración digital y diseño gráfico",
        imgPerfil: "diwin_art.png",
        descripcion: "Ilustradora con 5+ años de experiencia en arte digital. Especializada en personajes y conceptos.",
        ubicacion: "España",
        redesSociales: {
            instagram: "@diwin_art",
            tiktok: "@diwin_art",
            pinterest: "@diwin_art",
            x: ""
        }
    }
];

// _____________ ENCARGOS _____________

export const encargos = [
    {
        id: 1,
        nombre: "Logo para proyecto de plantas",
        descripcion: "Diseño de logotipo juguetón para una aplicación de cuidados y consejos para amantes de las plantas.",
        id_cliente: 8,
        id_artista: 1,
        precio: 14.99,
        fechaEntrega: "2026-05-15",
        estado: "completado",
        fase: 8,
        imagenes: ["logo_para_aplicacin_de_plantas_finalizado_2.png"],
        nombre_cliente: "Néstor De La Vega",
        email_cliente: "nestor@gmail.com",
        direccion_cliente: "C/Néstor 456",
        pais_cliente: "España",
        presupuesto_cliente: 30,
        borrado: false
    },
    {
        id: 2,
        nombre: "Diseño cabeza personaje \"Emily\" para una novela",
        descripcion: "Diseño para la protagonista de una novela gráfica de ciencia ficción.\nMirada desafiante, ojos ligeramente rasgados, flequillo y la boca pequeña. Paleta de colores ocura.",
        id_cliente: 2,
        id_artista: 1,
        precio: 20,
        fechaEntrega: "2026-06-20",
        estado: "en proceso",
        fase: 3,
        imagenes: ["encargo_1_1778767935.png"],
        nombre_cliente: "Ana Mar Flores",
        email_cliente: "anita@gmail.com",
        direccion_cliente: "C/Ana 456",
        pais_cliente: "España",
        presupuesto_cliente: 30,
        borrado: false
    },
    {
        id: 3,
        nombre: "Personaje OC Comic",
        descripcion: "Diseño de personaje original para novela de fantasía",
        id_cliente: 1,
        id_artista: 1,
        precio: 50,
        fechaEntrega: "2026-05-25",
        estado: "en proceso",
        fase: 3,
        imagenes: ["personaje_oc_comic.jpg"],
        nombre_cliente: "Lucia Lagos",
        email_cliente: "lucylc@gmail.com",
        direccion_cliente: "C/Lucia 123",
        pais_cliente: "España",
        presupuesto_cliente: 50,
        borrado: false
    },
    {
        id: 4,
        nombre: "Retrato digital - Familia",
        descripcion: "Retrato artístico digital de familia al estilo ilustración",
        id_cliente: 1,
        id_artista: 1,
        precio: 84.99,
        fechaEntrega: "2025-12-20",
        estado: "pendiente",
        fase: 1,
        imagenes: ["EncargoDefault.png"],
        nombre_cliente: "Lucia Lagos",
        email_cliente: "lucylc@gmail.com",
        direccion_cliente: "C/Lucia 123",
        pais_cliente: "España",
        presupuesto_cliente: 90,
        borrado: false
    },
    {
        id: 5,
        nombre: "Dibujo de la rata mascota de la clienta",
        descripcion: "Dibujo de rata sobre 2 patas mirando hacia arriba",
        id_cliente: null,
        id_artista: 1,
        precio: 20,
        fechaEntrega: "2026-06-05",
        estado: "en proceso",
        fase: 4,
        imagenes: ["encargo_1_1779177950.jpg"],
        nombre_cliente: "Elisa Zaino",
        email_cliente: "elisazagi@gmail.com",
        direccion_cliente: "C/ Lo Zaino",
        pais_cliente: "Italia",
        presupuesto_cliente: 23,
        borrado: false
    }
];

// _____________ LOGROS _____________

export const logros = [
    {
        imagen: "primer-trazo.png",
        titulo: "Primer trazo",
        info: "Recibe tu primer encargo",
        categoria: "encargos",
        referencia: 1
    },
    {
        imagen: "coleccionista.png",
        titulo: "Coleccionista",
        info: "Acumula 5 o más encargos",
        categoria: "encargos",
        referencia: 5
    },
    {
        imagen: "popular.png",
        titulo: "Popular",
        info: "Recibe 3 o más encargos",
        categoria: "encargos",
        referencia: 3
    },
    {
        imagen: "multitarea.png",
        titulo: "Multitarea",
        info: "Trabaja con 3 o más clientes distintos",
        categoria: "clientes",
        referencia: 3
    },
    {
        imagen: "IMPRESORA-HUMANA.png",
        titulo: "Imprenta humana",
        info: "Completa 5 o más proyectos",
        categoria: "completados",
        referencia: 5
    }
];
