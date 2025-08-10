const { httpServer } = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    
    // Start server only after successful DB connection
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    // Retry connection after 5 seconds
    console.log("Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

// Initial database connection
connectDB();
