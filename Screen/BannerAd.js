import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const BannerAd = ({ onPress }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  const [banners] = useState([
    {
      id: 1,
      image_url:
        'https://image.dienthoaivui.com.vn/x,webp,q90/https://dashboard.dienthoaivui.com.vn/uploads/dashboard/editor_upload/hinh-nen-bong-da-1.jpg',
    },
    {
      id: 2,
      image_url:
        'https://static.independent.co.uk/2021/08/29/14/85ace4848b73408a1c8daaf377214744Y29udGVudHNlYXJjaGFwaSwxNjMwMzI3OTkz-2.62001797.jpg',
    },
    {
      id: 3,
      image_url:
        'https://cdn.bongdaplus.vn/Assets/Media/2022/11/25/41/ronaldo7.jpg',
    },
    {
      id: 4,
      image_url:
        'https://images.teamtalk.com/content/uploads/2022/09/22210708/man-utd-centre-back-harry-maguire.jpg',
    },
    {
      id: 5,
      image_url:
        'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/11/20/1118715/Messi-Ronaldo.jpg',
    },
  ]);

  // Nhân đôi danh sách để tạo hiệu ứng cuộn vô hạn
  const infiniteBanners = [...banners, ...banners];

  useEffect(() => {
    const intervalId = setInterval(() => {
      scrollToNext();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);
  
  const scrollToNext = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= banners.length) {
      // Nếu cuộn đến cuối danh sách, quay về ảnh đầu tiên
      nextIndex = 0;
    }
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  };
  
  
  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    let index = Math.round(scrollPosition / screenWidth);
    
    if (index >= banners.length) {
      // Nếu cuộn đến cuối danh sách, quay về ảnh đầu tiên
      index = 0;
      flatListRef.current.scrollToIndex({ index: 0, animated: false });
    } else if (index < 0) {
      // Nếu cuộn về ảnh đầu tiên từ trái sang, quay về ảnh cuối
      index = banners.length - 1;
      flatListRef.current.scrollToIndex({ index: banners.length - 1, animated: false });
    }
    
    setCurrentIndex(index);
  };
  
  
  const BannerItem = ({ item }) => (
    <View 
    // onPress={() => navigation.navigate('Detail', { product: item })} 
    style={styles.bannerItem}>
      <Image source={{ uri: item.image_url }} style={styles.bannerImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={infiniteBanners}
        renderItem={({ item }) => <BannerItem item={item} onPress={onPress} />}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          if (index === infiniteBanners.length - 1) {
            flatListRef.current.scrollToIndex({ index: banners.length, animated: false });
          } else if (index === 0) {
            flatListRef.current.scrollToIndex({ index: banners.length, animated: false });
          }
        }}
      />
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex ? styles.paginationDotActive : null,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
  },
  bannerItem: {
    width: screenWidth,
    height: '100%',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    padding: 10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
  },
});

export default BannerAd;
