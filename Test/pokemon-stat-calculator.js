const ganbaruMultiplier = [0, 2, 3, 4, 7, 8, 9, 14, 15, 16, 25];

let baseStats = {}; // Stores base stats after fetching

async function fetchPokemonStats() {
    let pokemonName = document.getElementById("pokemon-select").value.toLowerCase().trim();
    
    if (!pokemonName) return;

    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Pokémon not found!");

        let data = await response.json();

        // Extract base stats
        baseStats = {};
        data.stats.forEach(stat => {
            baseStats[stat.stat.name] = stat.base_stat;
        });

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

function setNatureEffects() {
    const natures = {
        "adamant": { "attack": 1.1, "special-attack": 0.9 },
        "bold": { "defense": 1.1, "attack": 0.9 },
        "brave": { "attack": 1.1, "speed": 0.9 },
        "calm": { "special-defense": 1.1, "attack": 0.9 },
        "careful": { "special-defense": 1.1, "special-attack": 0.9 },
        "gentle": { "special-defense": 1.1, "defense": 0.9 },
        "hasty": { "speed": 1.1, "defense": 0.9 },
        "impish": { "defense": 1.1, "special-attack": 0.9 },
        "jolly": { "speed": 1.1, "special-attack": 0.9 },
        "lax": { "defense": 1.1, "special-defense": 0.9 },
        "lonely": { "attack": 1.1, "defense": 0.9 },
        "mild": { "special-attack": 1.1, "defense": 0.9 },
        "modest": { "special-attack": 1.1, "attack": 0.9 },
        "naive": { "speed": 1.1, "special-defense": 0.9 },
        "naughty": { "attack": 1.1, "special-defense": 0.9 },
        "quiet": { "special-attack": 1.1, "speed": 0.9 },
        "rash": { "special-attack": 1.1, "special-defense": 0.9 },
        "relaxed": { "defense": 1.1, "speed": 0.9 },
        "sassy": { "special-defense": 1.1, "speed": 0.9 },
        "timid": { "speed": 1.1, "attack": 0.9 }
    };

    let nature = document.getElementById("nature-select").value;
    let adjustments = natures[nature] || {};

    const statMapping = {
        "attack": "attack",
        "defense": "defense",
        "special-attack": "special-attack",
        "special-defense": "special-defense",
        "speed": "speed"
    };

    document.querySelectorAll("[name^='nature']").forEach(input => {
        let htmlStat = input.name.replace("nature-", "");
        let statKey = statMapping[htmlStat];

        if (statKey) {
            let effect = adjustments[statKey] !== undefined ? adjustments[statKey] : 1.0;
            input.checked = (parseFloat(input.value) === effect);
        }
    });
}

function getGanbaruMultiplier(gv, iv) {
    return ganbaruMultiplier[Math.min(gv + getBias(iv), 10)];
}

function getBias(iv) {
    return iv > 26 ? 3 : iv > 16 ? 2 : iv > 6 ? 1 : 0;
}

function getGanbaruStat(baseStat, iv, gv, level) {
    let mul = getGanbaruMultiplier(gv, iv);
    let step1 = Math.sqrt(baseStat) * mul;
    return Math.floor((step1 + level) / 2.5);
}

function getStat(baseStat, level, nature, statIndex) {
    let initial = Math.floor((((level / 50) * 1.0) * baseStat) / 1.5);
    return amplifyStat(nature, statIndex, initial);
}

function amplifyStat(nature, index, initial) {
    let natureMultiplier = getNatureAmp(nature, index);
    return natureMultiplier > 1 ? Math.floor((110 * initial) / 100) :
           natureMultiplier < 1 ? Math.floor((90 * initial) / 100) :
           initial;
}

function getNatureAmp(nature, index) {
    return document.querySelector(`input[name='nature-${index}']:checked`).value;
}
