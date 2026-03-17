"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_config_1 = require("../app/common/config/db.config");
const story_model_1 = require("../app/modules/story/story.model");
const user_model_1 = require("../app/modules/user/user.model");
const sampleStories = [
    {
        title: "Luna Found Her Weekend Trail Crew",
        summary: "A gentle retriever matched with an outdoorsy family and quickly became everyone’s hiking partner.",
        content: "Luna arrived shy but deeply affectionate. After a careful adoption review, she joined a family that wanted a calm dog for weekend hikes and quiet evenings. Within days, Luna had claimed the backseat for trail rides and now spends her mornings on wooded walks followed by long naps in the sun.",
        image: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=1400",
        petName: "Luna",
        adopterName: "The Morales Family",
        published: true,
    },
    {
        title: "Milo Finally Got His Window Seat",
        summary: "This social cat was adopted into a peaceful apartment where he now supervises the street from above.",
        content: "Milo needed a home that appreciated a vocal, affectionate cat with strong opinions about sunbeams. A retired teacher adopted him after several visits, and the match clicked immediately. Milo now rotates between his favorite window perch, a blanket by the couch, and a daily routine filled with attention and play.",
        image: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=1400",
        petName: "Milo",
        adopterName: "Eleanor B.",
        published: true,
    },
    {
        title: "Charlie Turned Foster Care Into Forever",
        summary: "A temporary placement gave Charlie time to settle, and his foster family never looked back.",
        content: "Charlie entered foster care to decompress and build confidence outside the shelter. What started as a short placement turned into a lasting bond as his foster family learned how playful, eager, and affectionate he really was. After a few weeks of progress and happy routines, they made the adoption official.",
        image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=1400",
        petName: "Charlie",
        adopterName: "Jordan and Priya",
        published: true,
    },
    {
        title: "Bella Became a Perfect First Family Dog",
        summary: "A patient lab mix found a home with kids, structure, and just the right energy level.",
        content: "Bella needed a stable home with predictable routines and people who would give her time to settle. After several meet-and-greets, she joined a family with two school-age children who wanted a steady companion. Bella now walks the kids to the bus stop every morning and curls up nearby during homework time.",
        image: "https://images.unsplash.com/photo-1494947665472-88aa455654c5?w=1400",
        petName: "Bella",
        adopterName: "The Nguyen Family",
        published: true,
    },
    {
        title: "Whiskers Chose the Quiet Life",
        summary: "A senior cat found exactly the kind of calm, comforting home he had been waiting for.",
        content: "Whiskers spent weeks politely observing shelter visitors from the back of his kennel, waiting for the right fit. A single adopter looking for a calm companion took the time to visit him repeatedly, and that patience paid off. Whiskers now rules a peaceful apartment with soft beds, low windows, and plenty of afternoon naps.",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=1400",
        petName: "Whiskers",
        adopterName: "Aaron T.",
        published: true,
    },
    {
        title: "Oreo Went From Rescue Intake to College Roommate",
        summary: "A playful young cat found a home with a student who wanted a lively companion.",
        content: "Oreo came in as a bright, energetic cat who needed daily engagement and a confident adopter. A graduate student looking for a social companion connected with her instantly. Oreo now spends her evenings chasing toys across the apartment and her nights curled beside a stack of textbooks.",
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1400",
        petName: "Oreo",
        adopterName: "Sana K.",
        published: true,
    },
    {
        title: "Rocky Learned to Relax in Foster",
        summary: "A high-energy boxer made major progress in foster care and is now thriving in a committed home.",
        content: "Rocky first entered foster care because shelter life was overwhelming for him. In a home setting, his goofy personality came through and his training consistency improved fast. His foster placement eventually turned into a permanent adoption, and Rocky now has a yard, a routine, and people who love his big personality.",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1400",
        petName: "Rocky",
        adopterName: "Cassie and Drew",
        published: true,
    },
];
const seedStories = async () => {
    try {
        await (0, db_config_1.connectDB)();
        const hashedPassword = await bcrypt_1.default.hash("password", 12);
        let author = await user_model_1.User.findOne({ email: "staff@petadopt.com" });
        if (!author) {
            author = await user_model_1.User.create({
                name: "Staff User",
                email: "staff@petadopt.com",
                password: hashedPassword,
                role: "Staff",
                isVerified: true,
            });
            console.log("Created fallback staff user for story ownership.");
        }
        let createdCount = 0;
        let updatedCount = 0;
        for (const story of sampleStories) {
            const existingStory = await story_model_1.Story.findOne({ title: story.title });
            if (existingStory) {
                await story_model_1.Story.updateOne({ _id: existingStory._id }, {
                    ...story,
                    createdBy: author._id,
                });
                updatedCount += 1;
                console.log(`Updated story: ${story.title}`);
            }
            else {
                await story_model_1.Story.create({
                    ...story,
                    createdBy: author._id,
                });
                createdCount += 1;
                console.log(`Created story: ${story.title}`);
            }
        }
        console.log(`Seeded stories successfully. Created: ${createdCount}, Updated: ${updatedCount}`);
        process.exit(0);
    }
    catch (error) {
        console.error("Error seeding stories:", error);
        process.exit(1);
    }
};
seedStories();
//# sourceMappingURL=seedStories.js.map