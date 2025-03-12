async function fetchPokemonStats() {
    let pokemonName = document.getElementById("pokemon-select").value.toLowerCase().trim();

    if (!pokemonName) {
        return;
    }

    let apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        let response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error("Pokémon not found! Check spelling.");
        }

        let data = await response.json();

        // Extract base stats
        let stats = {};
        data.stats.forEach(stat => {
            stats[stat.stat.name] = stat.base_stat;
        });

        // Update fields with fetched stats
        document.getElementById("attack").value = stats["attack"] || "";
        document.getElementById("def").value = stats["defense"] || "";
        document.getElementById("hp").value = stats["hp"] || "";

        // Set a default move power (example: first move from the API)
        if (data.moves.length > 0) {
            document.getElementById("base-power").value = 50; // Default value, since PokeAPI doesn't provide move power directly
        } else {
            document.getElementById("base-power").value = "";
        }

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}
