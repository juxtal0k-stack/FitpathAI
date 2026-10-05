export interface CountryInfo {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  states: StateInfo[];
}

export interface StateInfo {
  name: string;
  cities: CityInfo[];
}

export interface CityInfo {
  name: string;
  defaultPostalCode: string;
  lat: number;
  lng: number;
  nearbyAddresses: {
    address: string;
    postalCode: string;
    lat: number;
    lng: number;
    landmark: string;
  }[];
}

export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const;

export const COUNTRIES_DATA: CountryInfo[] = [
  {
    code: 'IN',
    name: 'India',
    dialCode: '+91',
    flag: '🇮🇳',
    states: [
      {
        name: 'Maharashtra',
        cities: [
          {
            name: 'Mumbai',
            defaultPostalCode: '400001',
            lat: 18.9220,
            lng: 72.8347,
            nearbyAddresses: [
              { address: '12 Marine Drive, Nariman Point', postalCode: '400021', lat: 18.9256, lng: 72.8242, landmark: 'Marine Drive Promenade' },
              { address: '45 Bandra West, Linking Road', postalCode: '400050', lat: 19.0596, lng: 72.8295, landmark: 'Near Bandra Bandstand' },
              { address: '78 Powai Central Ave, Hiranandani', postalCode: '400076', lat: 19.1176, lng: 72.9060, landmark: 'Opposite IIT Bombay Main Gate' },
              { address: '10 Andheri East, Chakala Metro Station Road', postalCode: '400093', lat: 19.1114, lng: 72.8687, landmark: 'Near Metro Pillar 42' },
            ],
          },
          {
            name: 'Pune',
            defaultPostalCode: '411001',
            lat: 18.5204,
            lng: 73.8567,
            nearbyAddresses: [
              { address: '22 FC Road, Shivajinagar', postalCode: '411005', lat: 18.5283, lng: 73.8415, landmark: 'Opposite Fergusson College' },
              { address: '88 Baner High Street, Baner', postalCode: '411045', lat: 18.5590, lng: 73.7868, landmark: 'Near Balewadi Sports Stadium' },
              { address: '14 Koregaon Park North Main Road', postalCode: '411001', lat: 18.5362, lng: 73.8940, landmark: 'Lane 5 Koregaon Park' },
            ],
          },
          {
            name: 'Nagpur',
            defaultPostalCode: '440001',
            lat: 21.1458,
            lng: 79.0882,
            nearbyAddresses: [
              { address: '15 Civil Lines, Palm Road', postalCode: '440001', lat: 21.1539, lng: 79.0729, landmark: 'Near High Court' },
              { address: '32 Dharampeth Extension', postalCode: '440010', lat: 21.1412, lng: 79.0619, landmark: 'Coffee House Square' },
            ],
          },
        ],
      },
      {
        name: 'Delhi NCR',
        cities: [
          {
            name: 'New Delhi',
            defaultPostalCode: '110001',
            lat: 28.6139,
            lng: 77.2090,
            nearbyAddresses: [
              { address: '14 Connaught Place Inner Circle', postalCode: '110001', lat: 28.6315, lng: 77.2167, landmark: 'Block B Rajiv Chowk' },
              { address: '25 Hauz Khas Village Main Gate', postalCode: '110016', lat: 28.5494, lng: 77.1932, landmark: 'Near Deer Park Gate' },
              { address: '88 South Extension Part II Market', postalCode: '110049', lat: 28.5684, lng: 77.2215, landmark: 'Near Metro Gate 2' },
              { address: '5 Delhi University North Campus, Chhatra Marg', postalCode: '110007', lat: 28.6896, lng: 77.2114, landmark: 'Arts Faculty Lawn' },
            ],
          },
        ],
      },
      {
        name: 'Karnataka',
        cities: [
          {
            name: 'Bangalore',
            defaultPostalCode: '560001',
            lat: 12.9716,
            lng: 77.5946,
            nearbyAddresses: [
              { address: '100 Indiranagar 100ft Road', postalCode: '560038', lat: 12.9719, lng: 77.6412, landmark: 'Corner of 12th Main Indiranagar' },
              { address: '42 Koramangala 4th Block, 80ft Road', postalCode: '560034', lat: 12.9344, lng: 77.6272, landmark: 'Near Sony World Junction' },
              { address: '7 Whitefield Main Road, ITPL', postalCode: '560066', lat: 12.9856, lng: 77.7289, landmark: 'Near Hope Farm Junction' },
              { address: '23 MG Road, Brigade Road Cross', postalCode: '560001', lat: 12.9754, lng: 77.6067, landmark: 'Trinity Metro Station Exit' },
            ],
          },
        ],
      },
      {
        name: 'Tamil Nadu',
        cities: [
          {
            name: 'Chennai',
            defaultPostalCode: '600001',
            lat: 13.0827,
            lng: 80.2707,
            nearbyAddresses: [
              { address: '18 Anna Nagar 2nd Avenue', postalCode: '600040', lat: 13.0850, lng: 80.2101, landmark: 'Near Roundtana Circle' },
              { address: '55 Besant Nagar Beach Road', postalCode: '600090', lat: 13.0003, lng: 80.2670, landmark: 'Elliot Beach Promenade' },
              { address: '30 T. Nagar Usman Road', postalCode: '600017', lat: 13.0418, lng: 80.2341, landmark: 'Panagal Park North Gate' },
            ],
          },
        ],
      },
      {
        name: 'Telangana',
        cities: [
          {
            name: 'Hyderabad',
            defaultPostalCode: '500001',
            lat: 17.3850,
            lng: 78.4867,
            nearbyAddresses: [
              { address: '21 HITEC City Road, Madhapur', postalCode: '500081', lat: 17.4474, lng: 78.3762, landmark: 'Near Cyber Towers' },
              { address: '44 Jubilee Hills Road No 36', postalCode: '500033', lat: 17.4319, lng: 78.4073, landmark: 'Peddamma Gudi Metro' },
              { address: '9 Banjara Hills Road No 1', postalCode: '500034', lat: 17.4156, lng: 78.4487, landmark: 'Taj Krishna Junction' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    dialCode: '+1',
    flag: '🇺🇸',
    states: [
      {
        name: 'California',
        cities: [
          {
            name: 'San Francisco',
            defaultPostalCode: '94102',
            lat: 37.7749,
            lng: -122.4194,
            nearbyAddresses: [
              { address: '100 Market Street, Financial District', postalCode: '94105', lat: 37.7937, lng: -122.3965, landmark: 'Near Ferry Building' },
              { address: '450 Mission Bay Blvd South', postalCode: '94158', lat: 37.7689, lng: -122.3892, landmark: 'UCSF Medical Center' },
              { address: '820 Valencia Street, Mission District', postalCode: '94110', lat: 37.7597, lng: -122.4214, landmark: 'Near Dolores Park' },
            ],
          },
          {
            name: 'Los Angeles',
            defaultPostalCode: '90001',
            lat: 34.0522,
            lng: -118.2437,
            nearbyAddresses: [
              { address: '1200 Wilshire Blvd, Downtown LA', postalCode: '90017', lat: 34.0537, lng: -118.2612, landmark: 'Good Samaritan Medical' },
              { address: '200 Westwood Plaza, UCLA Campus', postalCode: '90095', lat: 34.0700, lng: -118.4441, landmark: 'UCLA Wooden Center' },
              { address: '150 Ocean Ave, Santa Monica', postalCode: '90401', lat: 34.0116, lng: -118.4952, landmark: 'Santa Monica Pier Entrance' },
            ],
          },
        ],
      },
      {
        name: 'New York',
        cities: [
          {
            name: 'New York City',
            defaultPostalCode: '10001',
            lat: 40.7128,
            lng: -74.0060,
            nearbyAddresses: [
              { address: '350 5th Avenue, Midtown Manhattan', postalCode: '10118', lat: 40.7484, lng: -73.9857, landmark: 'Empire State Building' },
              { address: '70 Washington Square South, Greenwich Village', postalCode: '10012', lat: 40.7299, lng: -73.9972, landmark: 'NYU Bobst Library' },
              { address: '116th St & Broadway, Morningside Heights', postalCode: '10027', lat: 40.8075, lng: -73.9626, landmark: 'Columbia University Low Library' },
            ],
          },
        ],
      },
      {
        name: 'Texas',
        cities: [
          {
            name: 'Austin',
            defaultPostalCode: '78701',
            lat: 30.2672,
            lng: -97.7431,
            nearbyAddresses: [
              { address: '2100 Speedway, UT Austin Campus', postalCode: '78712', lat: 30.2849, lng: -97.7371, landmark: 'Gregory Gym Plaza' },
              { address: '500 W 2nd Street, Downtown Austin', postalCode: '78701', lat: 30.2662, lng: -97.7478, landmark: 'Lady Bird Lake Trailhead' },
            ],
          },
        ],
      },
      {
        name: 'Washington',
        cities: [
          {
            name: 'Seattle',
            defaultPostalCode: '98101',
            lat: 47.6062,
            lng: -122.3321,
            nearbyAddresses: [
              { address: '400 Pine Street, Downtown', postalCode: '98101', lat: 47.6114, lng: -122.3375, landmark: 'Westlake Center' },
              { address: '4000 15th Ave NE, University District', postalCode: '98195', lat: 47.6553, lng: -122.3035, landmark: 'UW Red Square' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    dialCode: '+44',
    flag: '🇬🇧',
    states: [
      {
        name: 'Greater London',
        cities: [
          {
            name: 'London',
            defaultPostalCode: 'SW1A 1AA',
            lat: 51.5074,
            lng: -0.1278,
            nearbyAddresses: [
              { address: '10 Strand, Westminster', postalCode: 'WC2N 5EH', lat: 51.5080, lng: -0.1280, landmark: 'Trafalgar Square' },
              { address: 'Imperial College Road, South Kensington', postalCode: 'SW7 2AZ', lat: 51.4988, lng: -0.1749, landmark: 'Science Museum Quad' },
              { address: 'Gower Street, Bloomsbury', postalCode: 'WC1E 6BT', lat: 51.5246, lng: -0.1340, landmark: 'UCL Main Library' },
            ],
          },
        ],
      },
      {
        name: 'West Midlands',
        cities: [
          {
            name: 'Birmingham',
            defaultPostalCode: 'B1 1BB',
            lat: 52.4862,
            lng: -1.8904,
            nearbyAddresses: [
              { address: 'University Road, Edgbaston', postalCode: 'B15 2TT', lat: 52.4508, lng: -1.9305, landmark: 'Old Joe Clocktower' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    dialCode: '+1',
    flag: '🇨🇦',
    states: [
      {
        name: 'Ontario',
        cities: [
          {
            name: 'Toronto',
            defaultPostalCode: 'M5H 2N2',
            lat: 43.6532,
            lng: -79.3832,
            nearbyAddresses: [
              { address: '27 King\'s College Circle', postalCode: 'M5S 1A1', lat: 43.6629, lng: -79.3957, landmark: 'U of T Front Campus' },
              { address: '100 University Ave, Financial District', postalCode: 'M5J 1V6', lat: 43.6475, lng: -79.3840, landmark: 'Union Station North' },
            ],
          },
        ],
      },
      {
        name: 'British Columbia',
        cities: [
          {
            name: 'Vancouver',
            defaultPostalCode: 'V6B 1A1',
            lat: 49.2827,
            lng: -123.1207,
            nearbyAddresses: [
              { address: '6333 Memorial Road, Point Grey', postalCode: 'V6T 1Z2', lat: 49.2606, lng: -123.2460, landmark: 'UBC Main Mall' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    dialCode: '+61',
    flag: '🇦🇺',
    states: [
      {
        name: 'New South Wales',
        cities: [
          {
            name: 'Sydney',
            defaultPostalCode: '2000',
            lat: -33.8688,
            lng: 151.2093,
            nearbyAddresses: [
              { address: 'Eastern Ave, Camperdown', postalCode: '2006', lat: -33.8886, lng: 151.1873, landmark: 'University of Sydney Quadrangle' },
              { address: 'George Street, Circular Quay', postalCode: '2000', lat: -33.8617, lng: 151.2108, landmark: 'Sydney Harbour Foreshore' },
            ],
          },
        ],
      },
      {
        name: 'Victoria',
        cities: [
          {
            name: 'Melbourne',
            defaultPostalCode: '3000',
            lat: -37.8136,
            lng: 144.9631,
            nearbyAddresses: [
              { address: 'Swanston Street, Parkville', postalCode: '3010', lat: -37.7983, lng: 144.9610, landmark: 'University of Melbourne Gate' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'DE',
    name: 'Germany',
    dialCode: '+49',
    flag: '🇩🇪',
    states: [
      {
        name: 'Berlin',
        cities: [
          {
            name: 'Berlin',
            defaultPostalCode: '10115',
            lat: 52.5200,
            lng: 13.4050,
            nearbyAddresses: [
              { address: 'Unter den Linden 6', postalCode: '10099', lat: 52.5180, lng: 13.3933, landmark: 'Humboldt University Campus' },
              { address: 'Strasse des 17. Juni 135', postalCode: '10623', lat: 52.5125, lng: 13.3269, landmark: 'TU Berlin Main Building' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    dialCode: '+33',
    flag: '🇫🇷',
    states: [
      {
        name: 'Île-de-France',
        cities: [
          {
            name: 'Paris',
            defaultPostalCode: '75001',
            lat: 48.8566,
            lng: 2.3522,
            nearbyAddresses: [
              { address: '47 Rue des Écoles, Latin Quarter', postalCode: '75005', lat: 48.8488, lng: 2.3438, landmark: 'Sorbonne University' },
              { address: 'Boulevard Saint-Germain', postalCode: '75006', lat: 48.8539, lng: 2.3338, landmark: 'Saint-Germain-des-Prés' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    dialCode: '+65',
    flag: '🇸🇬',
    states: [
      {
        name: 'Singapore Central',
        cities: [
          {
            name: 'Singapore',
            defaultPostalCode: '048624',
            lat: 1.3521,
            lng: 103.8198,
            nearbyAddresses: [
              { address: '21 Lower Kent Ridge Road', postalCode: '119077', lat: 1.2966, lng: 103.7764, landmark: 'NUS University Town' },
              { address: '50 Nanyang Avenue', postalCode: '639798', lat: 1.3483, lng: 103.6831, landmark: 'NTU North Spine' },
              { address: '10 Collyer Quay, Marina Bay', postalCode: '049315', lat: 1.2838, lng: 103.8536, landmark: 'Ocean Financial Centre' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'AE',
    name: 'United Arab Emirates',
    dialCode: '+971',
    flag: '🇦🇪',
    states: [
      {
        name: 'Dubai',
        cities: [
          {
            name: 'Dubai',
            defaultPostalCode: '00000',
            lat: 25.2048,
            lng: 55.2708,
            nearbyAddresses: [
              { address: 'Sheikh Mohammed bin Rashid Blvd, Downtown', postalCode: '00000', lat: 25.1972, lng: 55.2744, landmark: 'Burj Khalifa Fountain Walk' },
              { address: 'Dubai Knowledge Park, Block 11', postalCode: '00000', lat: 25.1118, lng: 55.1636, landmark: 'Knowledge Park Hub' },
            ],
          },
        ],
      },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    dialCode: '+81',
    flag: '🇯🇵',
    states: [
      {
        name: 'Tokyo',
        cities: [
          {
            name: 'Tokyo',
            defaultPostalCode: '100-0001',
            lat: 35.6762,
            lng: 139.6503,
            nearbyAddresses: [
              { address: '7-3-1 Hongo, Bunkyo-ku', postalCode: '113-8654', lat: 35.7126, lng: 139.7619, landmark: 'University of Tokyo Akamon' },
              { address: '1-1 Shibuya, Shibuya-ku', postalCode: '150-0002', lat: 35.6580, lng: 139.7016, landmark: 'Shibuya Crossing' },
            ],
          },
        ],
      },
    ],
  },
];
