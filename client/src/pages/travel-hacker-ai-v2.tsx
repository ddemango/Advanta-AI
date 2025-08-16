import { Helmet } from "react-helmet";
import TravelHackerAIV3 from "../components/TravelHackerAIV3";

export default function TravelHackerAIV2() {
  return (
    <div>
      <Helmet>
        <title>Travel Hacker AI Pro - Find Cheap Flights, Hotels & Cars | AI Trip Planner</title>
        <meta name="description" content="AI-powered travel search finds ultra-cheap flights, mistake fares, hotels and car rentals. Compare prices across dates with flexible search options." />
        <meta name="keywords" content="cheap flights, mistake fares, travel deals, flight search, hotel booking, car rental, AI travel planner" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Travel Hacker AI Pro - Find Cheap Flights & Mistake Fares" />
        <meta property="og:description" content="AI-powered travel search finds ultra-cheap flights, mistake fares, hotels and car rentals with flexible date options." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://advanta-ai.com/travel-hacker-ai-v2" />
      </Helmet>
      
      <TravelHackerAIV3 />
    </div>
  );
}