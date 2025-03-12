const elm = [0, 2, 3, 4, 7, 8, 9, 14, 15, 16, 25];

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

    // Explicit mapping from HTML radio name to API stat names
    const statMapping = {
        "hp": "hp",
        "attack": "attack",
        "defense": "defense",
        "special-attack": "special-attack",
        "special-defense": "special-defense",
        "speed": "speed"
    };

    document.querySelectorAll("[name^='nature']").forEach(input => {
        let htmlStat = input.name.replace("nature-", ""); // Extracts correct stat name
        let statKey = statMapping[htmlStat]; // Get the correct stat key for API

        if (statKey) {
            let effect = adjustments[statKey] !== undefined ? adjustments[statKey] : 1.0;
            input.checked = (parseFloat(input.value) === effect);
        }
    });
}
function calculateAdjustedStats() {
    let level = parseInt(document.getElementById("level").value);

    if (!baseStats["hp"] || isNaN(level) || level < 1) {
        alert("Please select a Pokémon and enter a valid level.");
        return;
    }

    let effortLevels = {
        "hp": parseInt(document.getElementById("hp-e-level").value) || 0,
        "attack": parseInt(document.getElementById("attack-e-level").value) || 0,
        "defense": parseInt(document.getElementById("defense-e-level").value) || 0,
        "special-attack": parseInt(document.getElementById("special-attack-e-level").value) || 0,
        "special-defense": parseInt(document.getElementById("special-defense-e-level").value) || 0,
        "speed": parseInt(document.getElementById("speed-e-level").value) || 0
    };

    let natureEffects = {
        "attack": parseFloat(document.querySelector("input[name='nature-attack']:checked").value),
        "defense": parseFloat(document.querySelector("input[name='nature-defense']:checked").value),
        "special-attack": parseFloat(document.querySelector("input[name='nature-special-attack']:checked").value),
        "special-defense": parseFloat(document.querySelector("input[name='nature-special-defense']:checked").value),
        "speed": parseFloat(document.querySelector("input[name='nature-speed']:checked").value)
    };

    let adjustedStats = {};

    function calculateStat(base, el, level, nature) {
        let elb = Math.round((Math.abs(Math.sqrt(base) * elm[Math.min(Math.max(el, 0), 10)] + level) / 2.5);
        return Math.floor(Math.floor((level / 50 + 1) * base / 1.5) * nature) + elb;
    }

    adjustedStats["hp"] = Math.floor((level / 100 + 1) * baseStats["hp"] + level) + Math.round((Math.abs(Math.sqrt(baseStats["hp"]) * elm[Math.min(Math.max(effortLevels.hp, 0), 10)] + level) / 2.5);
    adjustedStats["attack"] = calculateStat(baseStats["attack"], effortLevels["attack"], level, natureEffects["attack"]);
    adjustedStats["defense"] = calculateStat(baseStats["defense"], effortLevels["defense"], level, natureEffects["defense"]);
    adjustedStats["special-attack"] = calculateStat(baseStats["special-attack"], effortLevels["special-attack"], level, natureEffects["special-attack"]);
    adjustedStats["special-defense"] = calculateStat(baseStats["special-defense"], effortLevels["special-defense"], level, natureEffects["special-defense"]);
    adjustedStats["speed"] = calculateStat(baseStats["speed"], effortLevels["speed"], level, natureEffects["speed"]);

    // Update Display
    document.getElementById("adjusted-hp").textContent = adjustedStats["hp"];
    document.getElementById("adjusted-attack").textContent = adjustedStats["attack"];
    document.getElementById("adjusted-defense").textContent = adjustedStats["defense"];
    document.getElementById("adjusted-special-attack").textContent = adjustedStats["special-attack"];
    document.getElementById("adjusted-special-defense").textContent = adjustedStats["special-defense"];
    document.getElementById("adjusted-speed").textContent = adjustedStats["speed"];
}
