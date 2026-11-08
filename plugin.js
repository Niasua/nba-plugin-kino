const M3U_URL = "https://tu-sitio.com/lista-canales.m3u"; 

const NBA_SCHEDULE_API = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

async function getDailyNBAMatches() {
    try {
        const response = await fetch(NBA_SCHEDULE_API);
        const data = await response.json();
        
        let matches = [];
        if (data && data.events) {
            matches = data.events.map(event => {
                const competition = event.competitions[0];
                const homeTeam = competition.competitors.find(c => c.homeAway === 'home').team.displayName;
                const awayTeam = competition.competitors.find(c => c.homeAway === 'away').team.displayName;
                const status = event.status.type.description; // En vivo, Programado, Finalizado
                const gameTime = event.date;

                return {
                    id: event.id,
                    title: `${awayTeam} vs ${homeTeam}`,
                    subtitle: `Estado: ${status} - ${new Date(gameTime).toLocaleTimeString()}`,
                    homeTeam: homeTeam.toLowerCase(),
                    awayTeam: awayTeam.toLowerCase(),
                    status: status
                };
            });
        }
        return matches;
    } catch (e) {
        console.error("Error obteniendo partidos de la NBA:", e);
        return [];
    }
}

async function getChannelsFromM3U() {
    try {
        const response = await fetch(M3U_URL);
        const text = await response.text();
        
        // Parser básico de listas M3U
        const lines = text.split('\n');
        let channels = [];
        let currentChannel = {};

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith('#EXTINF:')) {
                const nameMatch = line.match(/tvg-name="([^"]+)"/);
                const titleMatch = line.split(',');
                currentChannel.name = nameMatch ? nameMatch[1] : (titleMatch[1] ? titleMatch[1].trim() : 'Canal sin nombre');
            } else if (line && !line.startsWith('#')) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = {};
            }
        }
        return channels;
    } catch (e) {
        console.error("Error cargando lista M3U:", e);
        return [];
    }
}

// Función principal que maneja las peticiones de Kino
async function handleRequest(request) {
    const path = request.path || "/";

    if (path === "/") {
        // 1. Obtener partidos y canales en paralelo
        const matches = await getDailyNBAMatches();
        const channels = await getChannelsFromM3U();

        // 2. Cruzar los datos (Buscar qué canal transmite el partido)
        const items = matches.map(match => {
            // Buscamos en la lista M3U un canal cuyo nombre coincida con alguno de los equipos
            const matchedChannel = channels.find(ch => {
                const chName = ch.name.toLowerCase();
                return chName.includes(match.homeTeam) || chName.includes(match.awayTeam) || chName.includes("nba");
            });

            return {
                title: match.title,
                subtitle: match.subtitle,
                // Si encuentra el canal, asigna la URL directa; si no, deja una url vacía o de aviso
                url: matchedChannel ? matchedChannel.url : "",
                isPlayable: matchedChannel ? true : false,
                poster: "https://a.espncdn.com/combiner/i?img=/i/leaguelogos/nba/500/nba.png"
            };
        });

        return {
            type: "catalog",
            items: items.length > 0 ? items : [{ title: "No hay partidos programados hoy o error al cargar", isPlayable: false }]
        };
    }

    return { type: "error", message: "Ruta no encontrada" };
}

// Exportar según la especificación de Kino apiVersion 20
export default { handleRequest };