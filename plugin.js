export async function home() {
    return {
        rows: [
            {
                title: "🏀 NBA by Niasua - Transmisiones en Vivo",
                genre: "deportes",
                items: [
                    {
                        id: "info_plugin",
                        type: "movie",
                        title: "Acerca de este Plugin",
                        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/A_large_blank_slate.jpg/220px-A_large_blank_slate.jpg",
                        description: "Objetivo: Proveer un acceso ágil y centralizado a los encuentros de la liga de básquetbol con reproducción HLS nativa."
                    },
                    {
                        id: "lakers_1",
                        type: "movie",
                        title: "Lakers vs Celtics",
                        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/220px-Los_Angeles_Lakers_logo.svg.png",
                        description: "Transmisión en vivo de prueba - Partido destacado de la jornada."
                    }
                ]
            }
        ]
    };
}

export async function resolve(item) {
    if (item.id === "lakers_1" || item.id === "info_plugin") {
        return {
            url: "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
        };
    }
    throw new Error("Contenido no encontrado");
}