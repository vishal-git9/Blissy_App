export type ProfileData = {
  id: number;
  age: number;
  name: string;
  bio: string;
  imageUrl: string;
  gender: string;
  hours: string;
  ratingCount: number;
  calls: string;
  rating: number;
};
export const HealerMockData: ProfileData[] = [
  {
    name: 'John Doe',
    age: 30,
    gender: 'male',
    rating: 4.5,
    id: 1,
    calls: '200',
    hours: '600',
    bio: 'Experienced healer with a passion for helping others.',
    ratingCount: 20,
    imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Jane Smith',
    age: 28,
    gender: 'female',
    rating: 4.2,
    hours: 'Available: 10am - 6pm',
    bio: 'Compassionate healer specializing in mental health.',
    ratingCount: 15,
    id:2,
    calls:"500",
    imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  // Add more mock data items as needed
  {
    name: 'Michael Johnson',
    age: 35,
    gender: 'male',
    rating: 4.7,
    id:3,
    calls:"230",
    hours: '4000',
    bio: 'Skilled healer with expertise in alternative medicine.',
    ratingCount: 25,
    imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    name: 'Emily Brown',
    age: 32,
    gender: 'female',
    rating: 4.0,
    id:4,
    calls:"230",
    hours: '1200',
    bio: 'Empathetic healer dedicated to holistic wellness.',
    ratingCount: 18,
    imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  // Add more mock data items as needed
  {
    name: 'David Wilson',
    age: 40,
    id:5,
    calls:"230",
    gender: 'male',
    rating: 4.8,
    hours: '700',
    bio: 'Experienced healer specializing in physical therapy.',
    ratingCount: 30,
    imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    name: 'Sarah Martinez',
    age: 26,
    id:6,
    calls:"230",
    gender: 'female',
    rating: 4.3,
    hours: '500',
    bio: 'Knowledgeable healer focused on nutrition and wellness.',
    ratingCount: 22,
    imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
  },
  // Add more mock data items as needed
];
