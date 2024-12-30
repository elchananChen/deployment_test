import mongoose from "mongoose";
// import Post from "./models/postModel"; // שנה את הנתיב אם יש צורך
import User from "./models/userModel.js"; // אם יש לך מודל למשתמשים
// import Provider from "./models/Provider"; // אם יש לך מודל ל-Providers
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
mongoose.connect(uri).then(() => {
  console.log("connected");
});

// // יצירת Seed Data
// const seedData = async () => {
//   try {
//     // יצירת משתמשים לדוגמה
//     const user = await User.create({
//       name: "John Doe",
//       email: "johndoe@example.com",
//     });

//     // יצירת Provider לדוגמה
//     const provider = await Provider.create({
//       name: "Food Delivery Service",
//       type: "ngo",
//     });

//     // יצירת נתוני פוסטים לדוגמה
//     const posts = [
//       {
//         userID: user._id,
//         providerID: provider._id,
//         providerType: "ngo",
//         title: "Meal Delivery for Elderly",
//         description: "Delivering meals to elderly people in need",
//         serviceType: ["Meal Delivery", "Food for Special Diets"],
//         status: ["Single mother", "Retiree"],
//         location: ["North", "Jerusalem and Surroundings"],
//       },
//       {
//         userID: user._id,
//         providerID: provider._id,
//         providerType: "private",
//         title: "Tutoring for High School Students",
//         description: "Providing tutoring services for high school students",
//         serviceType: ["Tutoring", "Skill Development"],
//         status: ["Undergraduate student", "Part-time worker"],
//         location: ["Central", "Sharon"],
//       },
//       {
//         userID: user._id,
//         providerID: provider._id,
//         providerType: "private",
//         title: "Plumbing Services in the Negev",
//         description: "Offering plumbing services in the Negev region",
//         serviceType: ["Leak Repair", "Pipe Installation"],
//         status: ["Active-duty soldier", "Person with a physical disability"],
//         location: ["Negev"],
//       },
//     ];

//     // הוספת הפוסטים למסד הנתונים
//     await Post.insertMany(posts);

//     console.log("Seed data added successfully!");
//     mongoose.connection.close(); // סיום החיבור למסד הנתונים
//   } catch (err) {
//     console.error("Error seeding data:", err);
//     mongoose.connection.close();
//   }
// };

// נתונים לספקים על בסיס היוזרים
const providersSeedData = [
  {
    providerType: "private",
    bannerImg: "https://example.com/images/provider1-banner.jpg",
    bio: "Providing home cleaning services to the community.",
    location: ["North", "Central"],
    webLink: "https://provider1.com",
    userID: "liammartinez123", // שם המשתמש של הלקוח
  },
  {
    providerType: "ngo",
    bannerImg: "https://example.com/images/provider2-banner.jpg",
    bio: "Helping people with mental health support.",
    location: ["Jerusalem and Surroundings", "Central"],
    webLink: "https://provider2.com",
    userID: "sophiataylor456", // שם המשתמש של הלקוח
  },
  {
    providerType: "private",
    bannerImg: "https://example.com/images/provider3-banner.jpg",
    bio: "Specialized in child care and babysitting services.",
    location: ["South", "Negev"],
    webLink: "https://provider3.com",
    userID: "oliverrodriguez789", // שם המשתמש של הלקוח
  },
  {
    providerType: "ngo",
    bannerImg: "https://example.com/images/provider4-banner.jpg",
    bio: "Providing educational resources for underprivileged children.",
    location: ["Shfela (Lowland)", "Galilee"],
    webLink: "https://provider4.com",
    userID: "isabellawilson012", // שם המשתמש של הלקוח
  },
  {
    providerType: "private",
    bannerImg: "https://example.com/images/provider5-banner.jpg",
    bio: "Personal training and fitness coaching.",
    location: ["Coastal Plain", "Central"],
    webLink: "https://provider5.com",
    userID: "ethanharris345", // שם המשתמש של הלקוח
  },
  // הוסף עוד ספקים לפי הצורך
];

// פונקציה להוספת ספקים
export const createProviderSeedData = async () => {
  try {
    // נכנס למאגר ומחפש את כל המשתמשים
    const users = await User.find();

    // עבור כל ספק, חפש את המשתמש לפי שם המשתמש ולבסוף הוסף אותו
    for (const providerData of providersSeedData) {
      const user = users.find((user) => user.username === providerData.userID);

      if (!user) {
        console.error(`User with username ${providerData.userID} not found.`);
        continue;
      }

      // בודק אם ספק כבר קיים למשתמש הזה
      const existingProvider = await Provider.findOne({ userID: user._id });
      if (existingProvider) {
        console.log(`Provider already exists for user ${user.username}`);
        continue;
      }

      // אם הספק לא קיים, הוסף אותו
      const newProvider = new Provider({
        providerType: providerData.providerType,
        bannerImg: providerData.bannerImg,
        bio: providerData.bio,
        location: providerData.location,
        webLink: providerData.webLink,
        userID: user._id, // אוספים את ה-ObjectId של המשתמש
      });

      const savedProvider = await newProvider.save();
      console.log(`Provider created successfully for user ${user.username}`);
    }
  } catch (error) {
    console.error("Error seeding providers:", error);
  }
};
