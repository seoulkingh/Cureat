// frontend/services/searchServiceTest.js

// 테스트용 더미 데이터
const mockSearchResults = [
  { 
    id: '101', 
    name: 'Italian Feast Pizza', 
    rating: 4.7, 
    reviews: '320+', 
    image: 'https://placehold.co/100x100/F5F5DC/6A4545?text=Pizza', 
    description: 'Freshly baked pizza with a variety of Italian meats and vegetables.'
  },
  { 
    id: '102', 
    name: 'Classic Burger Joint', 
    rating: 4.4, 
    reviews: '550+', 
    image: 'https://placehold.co/100x100/A9A9A9/4B4B4B?text=Burger', 
    description: 'A classic American burger with all the fixings, served with fries.'
  },
  { 
    id: '103', 
    name: 'Sushi Sashimi Set', 
    rating: 4.9, 
    reviews: '910+', 
    image: 'https://placehold.co/100x100/C1C1CD/333333?text=Sushi', 
    description: 'Finest cuts of salmon and tuna sashimi, with a side of authentic sushi.'
  },
  { 
    id: '104', 
    name: 'Spicy Thai Noodles', 
    rating: 4.5, 
    reviews: '420+', 
    image: 'https://placehold.co/100x100/E6E6FA/483D8B?text=Noodles', 
    description: 'Spicy stir-fried noodles with chicken and fresh vegetables.'
  },
  { 
    id: '105', 
    name: 'Cozy Coffee Cafe', 
    rating: 4.8, 
    reviews: '1,500+', 
    image: 'https://placehold.co/100x100/D3D3D3/696969?text=Coffee', 
    description: 'A quiet cafe with a wide selection of coffee and homemade pastries.'
  }
];

export const search = async (query) => {
  console.log(`Searching for: ${query}`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) || 
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      
      if (filteredResults.length > 0) {
        resolve(filteredResults);
      } else {
        resolve([]);
      }
    }, 1000);
  });
};
