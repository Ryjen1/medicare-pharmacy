import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useCart } from '../contexts/CartContext';

type Product = {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  image_url: string;
  stock: number;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Vitamin D3 5000 IU',
    description: 'High-potency vitamin D3 for immune support and bone health. 120 softgels.',
    price_cents: 2499,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    stock: 45,
  },
  {
    id: '2',
    name: 'Omega-3 Fish Oil',
    description: 'Premium fish oil with EPA & DHA for heart and brain health. 90 capsules.',
    price_cents: 3299,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    stock: 38,
  },
  {
    id: '3',
    name: 'Probiotic 50 Billion CFU',
    description: 'Advanced probiotic blend with 16 strains for digestive health. 30 capsules.',
    price_cents: 3999,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    stock: 52,
  },
  {
    id: '4',
    name: 'Zinc 50mg',
    description: 'Essential mineral for immune function and wound healing. 100 tablets.',
    price_cents: 1499,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    stock: 67,
  },
  {
    id: '5',
    name: 'Magnesium Glycinate',
    description: 'Highly absorbable magnesium for muscle relaxation and sleep. 120 capsules.',
    price_cents: 2799,
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    stock: 41,
  },
  {
    id: '6',
    name: 'Vitamin C 1000mg',
    description: 'Powerful antioxidant with rose hips for enhanced absorption. 180 tablets.',
    price_cents: 1999,
    image_url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    stock: 89,
  },
];

function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function HomeScreen() {
  const { add } = useCart();
  const [addedId, setAddedId] = React.useState<string | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  async function handleAddToCart(product: Product) {
    await add({
      product_id: product.id,
      name: product.name,
      unit_price_cents: product.price_cents,
      image_url: product.image_url,
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  }

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  function renderItem({ item }: { item: Product }) {
    const isAdded = addedId === item.id;
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
        <View style={styles.cardContent}>
          <View style={styles.stockBadge}>
            <Text style={styles.stockText}>In Stock</Text>
          </View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.footer}>
            <Text style={styles.price}>{formatPrice(item.price_cents)}</Text>
            <TouchableOpacity
              style={[styles.addButton, isAdded && styles.addButtonAdded]}
              onPress={() => handleAddToCart(item)}
              disabled={isAdded}
            >
              <Text style={styles.addButtonText}>
                {isAdded ? 'Added!' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Featured Products</Text>
        <Text style={styles.headerSubtitle}>Top-rated supplements for your wellness journey</Text>
      </View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#EFF6FF',
  },
  cardContent: {
    padding: 16,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  stockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addButtonAdded: {
    backgroundColor: '#10B981',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
