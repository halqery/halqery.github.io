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
        "adamant": { attack: 1.1, specialAttack: 0.9 },
        "modest": { attack: 0.9, specialAttack: 1.1 },
        "hasty": { speed: 1.1, defense: 0.9 },
        "bold": { attack: 0.9, defense: 1.1 }
    };

    let nature = document.getElementById("nature-select").value;
    let adjustments = natures[nature] || {};

    document.querySelectorAll("[name^='nature']").forEach(input => {
        let stat = input.name.split("-")[1];
        input.checked = (adjustments[stat] || 1) == input.value;
    });
}
function calculateAdjustedStats() {
    let level = parseInt(document.getElementById("level").value);

    if (!baseStats["hp"] || isNaN(level) || level < 1) {
        alert("Please select a Pokémon and enter a valid level.");
        return;
    }

    let effortLevels = {
        hp: parseInt(document.getElementById("hp-e-level").value) || 0,
        attack: parseInt(document.getElementById("attack-e-level").value) || 0,
        defense: parseInt(document.getElementById("defense-e-level").value) || 0,
        specialAttack: parseInt(document.getElementById("special-attack-e-level").value) || 0,
        specialDefense: parseInt(document.getElementById("special-defense-e-level").value) || 0,
        speed: parseInt(document.getElementById("speed-e-level").value) || 0
    };

    let adjustedStats = {};

    function calculateStat(base, el, level) {
        let elb = Math.round((Math.sqrt(base) * elm[Math.min(Math.max(el, 0), 10)] + level) / 2.5);
        return Math.floor((level / 50 + 1) * base / 1.5) + elb;
    }

    adjustedStats["hp"] = Math.floor((level / 100 + 1) * baseStats["hp"] + level) + Math.round((Math.sqrt(baseStats["hp"]) * elm[Math.min(Math.max(effortLevels.hp, 0), 10)] + level) / 2.5);
    adjustedStats["attack"] = calculateStat(baseStats["attack"], effortLevels.attack, level);
    adjustedStats["defense"] = calculateStat(baseStats["defense"], effortLevels.defense, level);
    adjustedStats["specialAttack"] = calculateStat(baseStats["special-attack"], effortLevels.specialAttack, level);
    adjustedStats["specialDefense"] = calculateStat(baseStats["special-defense"], effortLevels.specialDefense, level);
    adjustedStats["speed"] = calculateStat(baseStats["speed"], effortLevels.speed, level);

    // Update Display
    document.getElementById("adjusted-hp").textContent = adjustedStats["hp"];
    document.getElementById("adjusted-attack").textContent = adjustedStats["attack"];
    document.getElementById("adjusted-defense").textContent = adjustedStats["defense"];
    document.getElementById("adjusted-special-attack").textContent = adjustedStats["specialAttack"];
    document.getElementById("adjusted-special-defense").textContent = adjustedStats["specialDefense"];
    document.getElementById("adjusted-speed").textContent = adjustedStats["speed"];
}
