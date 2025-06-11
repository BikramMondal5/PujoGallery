# 🔱🖼️ PujoGallery - Share Your Pujo Moments

A social feed where users can share their pujo moments — post photos, videos, and thoughts, connect with others, react, comment, and celebrate the festival together

## 🌟 Features

- **Post Creation**: Share your Puja moments with text, images, and videos.
- **Blog Posts**: Create longer blog-style content with rich text formatting.
- **Rich Text Editor**: Format your posts with bold, italics, lists, and more.
- **Trending Hashtags**: Discover popular hashtags and join the conversation.
- **Suggested Users**: Connect with people who share your interests.
- **Interactive Feed**: Like, comment, and share posts to engage with the community.
- **Donation System**: Support the platform and get verified status with different badge tiers.
- **Social Sharing**: Share content across various social media platforms.
- **Mobile-Friendly Design**: Optimized for both desktop and mobile devices.
- **Sponsored Content**: View relevant sponsored banners and ads.

## 🛠️ Technologies Used

- **Frontend**: React, Next.js
- **Styling**: Tailwind CSS, CSS Variables, shadcn/ui
- **UI Components**: 
  - Radix UI (Primitives)
  - Lucide Icons
  - Embla Carousel
  - React Day Picker
  - Recharts (for charts/data visualization)
  - Vaul (for drawers)
- **State Management**: React Context API, React Hooks
- **Form Handling**: React Hook Form
- **Theming**: Next-themes for dark/light mode
- **Media Handling**: File uploads, image/video preview

## ⚙️ Installation

To set up PujoGallery locally, follow these steps:

1. **Clone the Repository**:
   Open your terminal and run the following command to clone the repository:
   ```bash
   git clone https://github.com/your-username/PujoGallery.git
   ```

2. **Navigate to the Project Directory**:
   Move into the project folder:
   ```bash
   cd PujoGallery
   ```

3. **Install Dependencies**:
   Install the required packages:
   ```bash
   npm install
   # OR
   pnpm install
   ```

4. **Package Installation Issue**:
   In case of dependency conflicts:
   ```bash
   npm install --legacy-peer-deps
   ```

## 🚀 How to Use

To start using PujoGallery, follow these steps:

1. **Start the Server**:
   Run the following command to start the server:
   - For Developer mode
   ```bash
   npm run dev
   # OR
   pnpm dev
   ```
   - For production
   ```bash
   npm run build
   npm start
   # OR
   pnpm build
   pnpm start
   ```

2. **Access the Application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

3. **Explore the Platform**:
   - Create posts with text, images, or videos
   - Write blog posts using the rich text editor
   - Format your content with text styling options
   - Engage with trending hashtags
   - Connect with suggested users
   - Support the community by donating and getting verified
   - Interact with posts by liking, commenting, and sharing

## 🧩 Key Components

- **Post Card**: Display posts with media, comments, and interaction buttons
- **Rich Text Editor**: Format text with various styling options
- **User Dropdown**: Access profile settings and logout
- **Mobile Navigation**: Easy navigation on smaller screens
- **Sharing Dialog**: Share content across various platforms
- **Donation Modal**: Support the platform and get verified status
- **Theme Provider**: Support for light and dark themes

## 🔒 Authentication

User authentication is handled through local storage in the demo version. In a production environment, implement a more secure authentication system.

## 🤝 Contribution

Feel free to fork this repository, raise issues, or submit pull requests to add features or improve the design.

## 📜 License

This project is licensed under the `MIT License`.