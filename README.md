# Shivam Taneja's Portfolio Website

This is the official repository for my personal website built with Next.js 15, featuring a modern design and an AI-powered chatbot to interact with visitors.

## 🌟 About the project

This branch (`design-v2`) contains the latest design updates for my portfolio website. The site showcases my work, skills, and provides a unique way for visitors to interact with an AI assistant that can answer questions about me and my work.

## 🧊 Visual Effects

### 3D Folding Scroll ("The Origami Effect") (Currently Disabled)

> **Note:** This feature is currently disabled and not active on the live site.

The home page features a custom-built 3D folding scroll effect. This creates the illusion of the website being a continuous sheet of paper folding through space as you scroll.

**How it works:**

1.  **Three Layers:** The content is rendered onto three distinct layers:
    - **Top Fold:** Rotated -90° (facing up).
    - **Center Fold:** Facing the user (viewport).
    - **Bottom Fold:** Rotated +90° (facing down).
2.  **Synchronization:** A layout manager intercepts the native scroll position and synchronizes it with the `translateY` properties of all three layers instantly.
3.  **The Illusion:** As content leaves the Center layer, it immediately enters the angled Top or Bottom layers, creating a seamless 3D folding animation.

**Visual Diagram:**

```text
      /  <-- Top Copy (Tilted -90deg)
     /       (Shows the content that has scrolled past)
    /

    |    <-- Center Copy (Flat)
    |        (Shows the current content)
    |

    \
     \       (Shows the content coming up next)
      \  <-- Bottom Copy (Tilted +90deg)
```

## ✨ Key Features

- Modern, responsive design built with Next.js 15
- AI-powered chatbot using Groq and Mem0 for contextual memory
- Email contact form
- MDX support for rich content
- Dynamic Open Graph cards for pages and projects

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Styling**: GSAP for animations, Shadcn UI for components
- **AI**: Groq AI, mem0ai
- **Backend**: Next.js API routes, MongoDB
- **Authentication**: NextAuth.js
- **State Management**: Zustand, React Query

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- yarn
- MongoDB database (local or Atlas)
- Groq AI and Mem0 API keys (for chatbot functionality)

### Installation

1. Clone the repository

```bash
git clone https://github.com/username/shivam-portfolio-website.git
cd shivam-portfolio-website
git checkout design-v2
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables
   Create a `.env` file in the root directory, take reference from `.env.sample` file.

1. Run the development server

```bash
yarn dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 💬 Chatbot Functionality

The AI chatbot is powered by Groq AI and uses Mem0 to find relevant information about me to answer visitor questions.

For detailed information on how the chatbot works, please see the [Chatbot Documentation](/docs/chatbot.md).

### Running without the chatbot

If you don't want to set up the chatbot functionality, you can comment out the chatbot component in `src/components/wrapper.tsx`:

```tsx
{
  /* Temporarily disable chatbot
    <ChatBot /> 
*/
}
```

## 🔐 Admin Dashboard

The website includes an admin dashboard (accessible only to authorized users) with features for chat monitoring.

For detailed information on the dashboard functionality, please see the [Dashboard Documentation](/docs/dashboard.md).

## 🤖 Content Crawler

This project includes an automated content crawler that processes website content and ingests it into Mem0 for the chatbot.

For detailed information on how the crawler works, please see the [Crawler Documentation](/docs/crawler.md).

## 📧 Email Functionality

To see the email designs locally, run:

```bash
yarn email
```

This will start a local server to preview email templates.

## 🖼️ Open Graph images

Link previews are generated with `next/og` from one shared card. There is no static PNG for them.

The layout follows this design reference: [OG Playground](https://og-playground.vercel.app/?share=xVdtj6M2EP4rFqdTEolNgLyjzarp7p0uba-tLqvbD91-MGCI9wAj4ySbRtvf3jGEdzbdVK1qKcF4bM_MMzOPzVGxmUMUU7l26O4xRCgWB58sjkfZR2hDqLcRJuromva-o6aDe-qITW3MoXHk4wOMuj55zkZl_45yYgvKQpDZzN8GYSaNWExPAk58LOiOZCK2I9z12R5EG-o4JF9jYfubx9k2dG6ZzzjI32lYczS7OWEVYI-Y6ShCHZ-GBPMrj2OHklB09YnmEE9F7zRXH-kG0t7L_gx2myPpWS_bEYxOFZEZcUmuyGWh-IgD6kunAxayOML2yYGXl8fwRnYyVOu4VpzHVgy4iNx5hASLTKSpyCcugA8dnoYBehYTggWym01uh_51JFqw4J6Fu8Z4rGY_ra-NekiPnlUkOA7BNQ7z5EAPrKqtnqdAXrJJm5Vr-gcBJ0Za9IzkXzZHgonQAPA8j-hrOGCfeuFKkCCWGQgWEF4II-w4NPRkNk9A79Ao9IJtjDuEf39CvAOGI4gUdVpdnbU6lWVpukJTjYlqjGD6NJ-dupdkS-pd7ljDo6zy9JGaV6bsp3Z-gXBswcf5fA5DzTpxZ1N9qsMuAeYeDb-c1htgQYLuf67fslxj9P_pn1lj2510LlCXGvpTUoT6RE1KPs1SfaoWvDDD8-nckBuftkXoz8F-w4AcTmoGoOdylR28FQzGSmrHkhMEZPAayCbJ2-F5Q9afVl-Xn--XP3_4Ydm__eVz3aCsl5XWGdPkA0xQ2wuqVEkaGkMtlcx4w8Ztp0Sh8bT3KWVGs7KHBSG0kcI5YpAtxfte8i1UZ1lSoD5tCh5O2TfVqjJJjZ-yzOxrRlVYjdxVVVo5T2Kgy6uYcOqWzU2pQrbce4jwhu5wgO5xSJ5wDkoprG_OugwFeH1-SCttIl8LJIC6ai4OISPP5R-oBt4PC93F5LQca3SQhHYwuB7IVfVdbtbMFXs4RRAJYQkhHNkcuwLgRBFnzjbJoORgImiN8VpF67sfY4RDBy1_XcX92rYXoiQfDxwDSJ09PKq4DSWPlQw-_ta5P0RkbXMaCZjaufXZ1pGd5Sr5jyJ0R3ad3_sBjrpd0UOLG9QtJ0Q1sWX7Rg6Lo8iTIG1tGS_buayXrahXefDpo_LBl7UqU1dTXbYq8U5ekV90dOZLmwQO1zSsz5pTS_zYNKGenLUJRUnJVoqfbDWsyzQuW6-XiysMX8mqf8p9bST779FeHvxhZbgaT7irVIS1-2TLlXo4Lm6C-nCuzg247UwgxBO4NjZHtXGvEvlWfrumgVc2I-b24lHZCBHF5mCw3-_7ccKAIiHAvs2CwYZgJ94w0Y9C71EpL04uEIujMZ5UIpteJprjedxqwAANMusJgvaRynPalp8rMjrF2uyGUc-atxNx7cLRPPmN_t9y73fy4y62DilC55K16KVPRVVYJHMyVsyjksCmmHNtqCopVoo5gqNPcYi19RTTxX5MVIUE7IlK1oPvSbFP3mAf6cSHwCKOYgq-JS-qIrAFM74SbhNfefkL).

**Routes:**

- `/` uses `/og/home`
- `/projects` uses `/og/projects`
- `/contact`, `/experience`, `/certificates`, `/mentorship`, `/stats`, and `/socials` use `/og/{page}`
- Each project page uses `/og/projects/{slug}`

**Where to edit the copy:**

- Homepage: `src/lib/og/home.ts`
- Projects index: `src/lib/og/projects-index.ts`
- Contact, experience, certificates, mentorship, stats, and socials: `src/lib/og/pages.ts`
- Individual projects: `src/lib/constants/side-projects.ts`. Set `tags` for the stack, and `og` when the card title, description, or accent should differ from the listing. Ask Shivam is the extra entry in `src/lib/og/projects.ts`.

The portrait is `public/headshot.png`. Fonts live in `src/assets/fonts/`. Shared types are in `src/types/og.types.ts`.

Each card keeps one accent from the palette, so the preview does not change between requests. Set `accent` on a card to pin a color.

## 📚 Technical Documentation

For more detailed technical documentation, please refer to the following:

- [Architecture Overview](/docs/architecture.md)

## 🔧 Customization

To customize the website for your own use:

1. Update personal information in the relevant data files
2. Replace images in the public directory
3. Modify the theme in the tailwind configuration
4. Update content in the MDX files

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

Feel free to reach out to me at business.shivamtaneja@gmail.com if you have any questions or feedback.

---

Built with ❤️ by Shivam Taneja
