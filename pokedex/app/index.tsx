import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPokemons(limit);
  }, [limit]);

  async function fetchPokemons(limitValue: number) {
    try {
      setLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limitValue}`
      );
      const data = await response.json();

      const detailedPokemons = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res = await fetch(pokemon.url);
          const details = await res.json();
          return {
            name: pokemon.name,
            image: details.sprites.front_default,
            imageBack: details.sprites.back_default,
            types: details.types,
          };
        })
      );

      setPokemons(detailedPokemons);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function searchPokemon() {
    if (!search.trim()) return fetchPokemons(limit);

    try {
      setLoading(true);
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${search.toLowerCase()}`
      );
      if (!response.ok) {
        setPokemons([]);
        return;
      }
      const details = await response.json();
      setPokemons([
        {
          name: details.name,
          image: details.sprites.front_default,
          imageBack: details.sprites.back_default,
          types: details.types,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 16, padding: 16 }}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Pokémon by name..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={searchPokemon}
        />
        <TouchableOpacity style={styles.searchButton} onPress={searchPokemon}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Limit Selector */}
      <View style={styles.limitContainer}>
        <TouchableOpacity onPress={() => setLimit(10)}>
          <Text style={limit === 10 ? styles.limitActive : styles.limitText}>
            10
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLimit(20)}>
          <Text style={limit === 20 ? styles.limitActive : styles.limitText}>
            20
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setLimit(50)}>
          <Text style={limit === 50 ? styles.limitActive : styles.limitText}>
            50
          </Text>
        </TouchableOpacity>
      </View>

      {/* Pokémon List */}
      {loading ? (
        <Text style={{ textAlign: "center" }}>Loading...</Text>
      ) : pokemons.length === 0 ? (
        <Text style={{ textAlign: "center" }}>No Pokémon found.</Text>
      ) : (
        pokemons.map((pokemon) => (
          <Link
            key={pokemon.name}
            href={{ pathname: "/details", params: { name: pokemon.name } }}
            style={{
              backgroundColor:
                colorsByType[pokemon.types[0]?.type.name] + "40",
              padding: 20,
              borderRadius: 20,
            }}
          >
            <View>
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.type}>{pokemon.types[0]?.type.name}</Text>
              <View style={{ flexDirection: "row", height: 150 }}>
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 150, height: 150 }}
                />
                <Image
                  source={{ uri: pokemon.imageBack }}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            </View>
          </Link>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  type: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: "#6390F0",
    paddingHorizontal: 15,
    borderRadius: 10,
    justifyContent: "center",
  },
  limitContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 10,
  },
  limitText: {
    fontSize: 16,
    color: "gray",
  },
  limitActive: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
