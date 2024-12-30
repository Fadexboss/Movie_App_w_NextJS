## Project description

The Movie Guessing Game offers users the chance to guess a randomly selected movie from IMDb's top 250 movies list. Users try to guess the correct movie using the clues given about the movie (such as actors, genre, release year, director, IMDb score). Points are earned with correct guesses, while incorrect guesses and additional clues reduce the score. Users try to find the correct answer before the time runs out and can compete in multiple rounds.

Features:

1) A random selection is made from IMDb's best movies. Hints in different categories about the movie (such as: actors, genre, release year).
2) An interactive guessing mechanism to check user inputs.
3) Race against time with a countdown timer.
4) Users can measure their success with a scoring system.
5) View the movie poster after correct guesses.
6) Multi-round support and result notification at the end of the game.

Technologies Used:
1) Frontend: React (Next.js)
2) Backend: OMDB API (to get movie information)
3) CSS: Style optimization with LightningCSS
4) CSV Processing: Papaparse (to process movie list data)



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
