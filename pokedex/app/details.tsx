import { useLocalSearchParams, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { 
  Text, 
  View, 
  ScrollView, 
  Image, 
  StyleSheet, 
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonStat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
  stats: PokemonStat[];
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

export default function Details() {
  const params = useLocalSearchParams();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchPokemonByName(name: string) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();

      const fetched: Pokemon = {
        name: data.name,
        image: data.sprites.front_default,
        imageBack: data.sprites.back_default,
        types: data.types,
        stats: data.stats,
      };

      setPokemon(fetched);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.name) {
      fetchPokemonByName(params.name as string);
    }
  }, [params.name]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="black" />
      </SafeAreaView>
    );
  }

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Pokémon not found </Text>
      </SafeAreaView>
    );
  }

  const mainType = pokemon.types[0].type.name;
  const bgColor = colorsByType[mainType] || "#A8A77A";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor + "40" }]}>
      <Stack.Screen options={{ title: pokemon.name.toUpperCase() }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Pokémon Name */}
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>

        {/* Type Badges */}
        <View style={styles.typeContainer}>
          {pokemon.types.map((t) => (
            <View 
              key={t.type.name} 
              style={[styles.typeBadge, { backgroundColor: colorsByType[t.type.name] }]}
            >
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        {/* Pokémon Images */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: pokemon.image }} style={styles.image} />
          <Image source={{ uri: pokemon.imageBack }} style={styles.image} />
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Base Stats</Text>
          {pokemon.stats.map((s) => (
            <View key={s.stat.name} style={styles.statRow}>
              <Text style={styles.statName}>{s.stat.name.toUpperCase()}</Text>
              <Text style={styles.statValue}>{s.base_stat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
    color: "#222",
    marginBottom: 10,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  typeBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  typeText: {
    color: "white",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 30,
  },
  image: {
    width: 130,
    height: 130,
  },
  statsContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: 16,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  statName: {
    fontWeight: "500",
    color: "#555",
  },
  statValue: {
    fontWeight: "700",
    color: "#222",
  },
  error: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 18,
    color: "gray",
  },
});
