import type { Route } from "./+types/home";
import Navbar from "../components/Navbar";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ai Resume" },
    { name: "description", content: "smart feedback for your dream job" },
  ];
}

export default function Home() {
  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />
    <section className="main-section">
      <div>
        <h1> Track Your Application & Resume Ratings</h1>
        <h2>Review Your Submissions and Check AI-Powered Feedback</h2>
      </div>
    </section>

    {resumes.length > 0 && (
      <div className="resumes-section">
        {resumes.map(resume => (
          <ResumeCard key={resume.id} resume={resume} />
        ))}
      </div>
    )}


  </main>
}
