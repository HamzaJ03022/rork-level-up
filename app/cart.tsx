import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useCartStore } from '@/store/cart-store';
import { products } from '@/constants/shop';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react-native';

export default function CartScreen() {
  const router = useRouter();
  const cartItems = useCartStore(state => state.items);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeItem = useCartStore(state => state.removeItem);
  const clearCart = useCartStore(state => state.clearCart);
  
  // Get product details for each cart item
  const cartProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter(item => item.product); // Filter out any items where product wasn't found
  
  // Calculate subtotal
  const subtotal = cartProducts.reduce((sum, item) => {
    if (!item.product) return sum;
    
    const price = item.product.discountPercentage > 0
      ? item.product.price * (1 - item.product.discountPercentage / 100)
      : item.product.price;
      
    return sum + (price * item.quantity);
  }, 0);
  
  // Fixed shipping cost
  const shipping = subtotal > 0 ? 4.99 : 0;
  
  // Calculate total
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(productId, newQuantity);
    } else if (newQuantity < 1) {
      removeItem(productId);
    }
  };

  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout flow
    alert('Checkout functionality would be implemented here in a real app.');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: "Shopping Cart",
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <ArrowLeft size={24} color={Colors.dark.text} />
            </Pressable>
          ),
        }} 
      />
      
      {cartProducts.length > 0 ? (
        <>
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {cartProducts.map(item => {
              if (!item.product) return null;
              
              const discountedPrice = item.product.discountPercentage > 0
                ? item.product.price * (1 - item.product.discountPercentage / 100)
                : item.product.price;
                
              return (
                <View key={item.productId} style={styles.cartItem}>
                  <Pressable 
                    style={styles.productImageContainer}
                    onPress={() => router.push(`/product/${item.productId}`)}
                  >
                    <Image 
                      source={{ uri: item.product.imageUrl }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                  
                  <View style={styles.productInfo}>
                    <Text 
                      style={styles.productName}
                      numberOfLines={1}
                      onPress={() => router.push(`/product/${item.productId}`)}
                    >
                      {item.product.name}
                    </Text>
                    
                    {item.product.discountPercentage > 0 ? (
                      <View style={styles.priceContainer}>
                        <Text style={styles.originalPrice}>${item.product.price.toFixed(2)}</Text>
                        <Text style={styles.discountedPrice}>${discountedPrice.toFixed(2)}</Text>
                      </View>
                    ) : (
                      <Text style={styles.price}>${item.product.price.toFixed(2)}</Text>
                    )}
                    
                    <View style={styles.quantityContainer}>
                      <Pressable 
                        style={styles.quantityButton}
                        onPress={() => handleQuantityChange(item.productId, -1, item.quantity)}
                      >
                        <Minus size={16} color={Colors.dark.text} />
                      </Pressable>
                      
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      
                      <Pressable 
                        style={[
                          styles.quantityButton,
                          item.quantity >= 10 && styles.quantityButtonDisabled
                        ]}
                        onPress={() => handleQuantityChange(item.productId, 1, item.quantity)}
                        disabled={item.quantity >= 10}
                      >
                        <Plus size={16} color={item.quantity >= 10 ? Colors.dark.inactive : Colors.dark.text} />
                      </Pressable>
                    </View>
                  </View>
                  
                  <Pressable 
                    style={styles.removeButton}
                    onPress={() => removeItem(item.productId)}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <Trash2 size={20} color={Colors.dark.error} />
                  </Pressable>
                </View>
              );
            })}
            
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
            </View>
            
            <Pressable 
              style={styles.clearCartButton}
              onPress={clearCart}
            >
              <Text style={styles.clearCartText}>Clear Cart</Text>
            </Pressable>
          </ScrollView>
          
          <View style={styles.footer}>
            <Pressable 
              style={styles.checkoutButton}
              onPress={handleCheckout}
              testID="cart-checkout"
            >
              <ShoppingBag size={20} color="#FFFFFF" />
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color={Colors.dark.inactive} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Browse our shop to find products that will help you level up your appearance
          </Text>
          <Pressable 
            style={styles.shopButton}
            onPress={() => router.push('/shop')}
          >
            <Text style={styles.shopButtonText}>Go to Shop</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
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
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    width: 30,
    textAlign: 'center',
  },
  removeButton: {
    padding: 4,
  },
  summaryContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.dark.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingTop: 12,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
  clearCartButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearCartText: {
    fontSize: 14,
    color: Colors.dark.error,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.dark.card,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    padding: 16,
    paddingBottom: 32,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    borderRadius: 8,
    paddingVertical: 16,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 300,
  },
  shopButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});