import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Navbar from "~/components/Navbar";

interface ResumeData {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  resumePath: string;
  imagePath: string;
  feedback: any;
}

const Resume = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { kv } = usePuterStore();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResumeData = async () => {
      if (!id) return;
      
      try {
        const data = await kv.get(`resume:${id}`);
        if (data) {
          setResumeData(JSON.parse(data));
        } else {
          setResumeData(null);
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
        setResumeData(null);
      } finally {
        setLoading(false);
      }
    };

    loadResumeData();
  }, [id, kv]);

  if (loading) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Loading...</h1>
          </div>
        </section>
      </main>
    );
  }

  if (!resumeData) {
    return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover">
        <Navbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Resume not found</h1>
            <button 
              onClick={() => navigate('/upload')}
              className="primary-button mt-4"
            >
              Upload New Resume
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Resume Analysis Results</h1>
          <div className="bg-white rounded-2xl p-8 mt-8 max-w-4xl w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Job Details</h2>
              <p><strong>Company:</strong> {resumeData.companyName}</p>
              <p><strong>Position:</strong> {resumeData.jobTitle}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Analysis Results</h2>
              {resumeData.feedback ? (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(resumeData.feedback, null, 2)}
                </pre>
              ) : (
                <p>No analysis results available</p>
              )}
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/upload')}
                className="primary-button"
              >
                Analyze Another Resume
              </button>
              <button 
                onClick={() => navigate('/')}
                className="secondary-button"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Resume;
