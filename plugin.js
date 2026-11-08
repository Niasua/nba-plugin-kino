export async function home() {
    return {
        catalogs: [
            {
                id: "nba_catalog",
                title: "Partidos de Hoy",
                type: "live",
                items: [
                    {
                        id: "lakers_1",
                        type: "movie",
                        title: "Lakers vs Celtics",
                        poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Los_Angeles_Lakers_logo.svg/220px-Los_Angeles_Lakers_logo.svg.png",
                        description: "Transmisión en vivo de prueba."
                    }
                ]
            }
        ]
    };
}

export async function resolve(item) {
    if (item.id === "lakers_1") {
        return {
            url: "http://sample.vodobox.net/skate_phantom_flex_4k/skate_phantom_flex_4k.m3u8"
        };
    }
    throw new Error("Partido no encontrado");
}