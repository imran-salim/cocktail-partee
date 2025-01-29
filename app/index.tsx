import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, ScrollView, Image, Keyboard, FlatList } from "react-native";

export default function Index() {
  const [searchText, setSearchText] = useState('');
  const [cocktails, setCocktails] = useState<{ idDrink: string; strDrink: string, strDrinkThumb: string }[]>([]);

  const fetchData = async () => {
    try {
      if (!searchText) {
        return;
      }

      const ingredients = await fetch('https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
      const ingredientData = await ingredients.json();
      const ingredientList = ingredientData.drinks.map((ingredient: { strIngredient1: string }) => ingredient.strIngredient1.toLowerCase());
      if (!ingredientList.includes(searchText.toLowerCase())) {
        alert(`'${searchText}' is not a valid liquor`);
        return;
      }

      const cocktails = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${searchText}`);
      const cocktailData = await cocktails.json();
      setCocktails(cocktailData.drinks);
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={styles.heading}>Cocktail Partee</Text>
      <TextInput 
        style={styles.searchBar} 
        value={searchText} 
        onChangeText={setSearchText} 
        placeholder="Enter a liquor" 
      />
      <View style={styles.searchButton}>
          <Button title="Search" onPress={() => fetchData()} />
      </View>
      <FlatList 
        style={styles.scrollview}
        data={cocktails}
        renderItem={({ item }) => (
          <View 
            style={styles.cocktail} 
            key={item.idDrink}
          >
            <Text style={styles.cocktailName}>{item.strDrink}</Text>
            <Image 
              source={{ uri: item.strDrinkThumb }} 
              style={styles.cocktailImage} 
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 12,
  },
  searchBar: {
    color: 'black',
    borderWidth: 1,
    borderColor: 'black',
    height: 40,
    width: '40%',
    margin: 12,
    paddingLeft: 8,
    alignSelf: 'center',
    borderRadius: 2,
  },
  searchButton: {
    width: '25%',
    alignSelf: 'center',
  },
  cocktail: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    margin: 16,
    width: '100%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  cocktailName: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cocktailImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  scrollview: {
    padding: 8,
    margin: 8,
    width: '50%',
    alignSelf: 'center',
  },
});
