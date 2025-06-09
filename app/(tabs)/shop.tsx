import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { Search, Filter, Star, ShoppingCart } from 'lucide-react-native';
import { products, categories } from '@/constants/shop';
import { useCartStore } from '@/store/cart-store';

export default function ShopScreen() {
  const router = useRouter();
  const cartItems = useCartStore(state => state.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Filter products based on search query and selected category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleCartPress = () => {
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Shop",
          headerRight: () => (
            <Pressable 
              onPress={handleCartPress}
              style={({ pressed }) => [
                styles.cartButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <ShoppingCart size={24} color={Colors.dark.text} />
              {totalCartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                </View>
              )}
            </Pressable>
          ),
        }} 
      />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={Colors.dark.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor={Colors.dark.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <Pressable style={styles.filterButton}>
          <Filter size={20} color={Colors.dark.text} />
        </Pressable>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && { backgroundColor: category.color }
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text 
              style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      
      <ScrollView style={styles.productsContainer} contentContainerStyle={styles.productsContent}>
        <View style={styles.productsGrid}>
          {filteredProducts.map(product => (
            <Pressable
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product.id)}
            >
              <Image 
                source={{ uri: product.imageUrl }} 
                style={styles.productImage}
                resizeMode="cover"
              />
              
              {product.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-{product.discountPercentage}%</Text>
                </View>
              )}
              
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                
                <View style={styles.ratingContainer}>
                  <Star size={12} color={Colors.dark.warning} fill={Colors.dark.warning} />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
                
                <View style={styles.priceContainer}>
                  {product.discountPercentage > 0 ? (
                    <>
                      <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                      <Text style={styles.discountedPrice}>
                        ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        
        {filteredProducts.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No products found</Text>
            <Text style={styles.emptyStateText}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.dark.text,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    maxHeight: 50,
    paddingHorizontal: 8,
  },
  categoriesContent: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.dark.card,
    marginRight: 8,
  },
  categoryButtonText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  productsContainer: {
    flex: 1,
  },
  productsContent: {
    padding: 16,
    paddingTop: 8,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.dark.error,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
});