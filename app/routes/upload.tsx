import { useState, type FormEvent } from "react"
import FileUploader from "~/components/FileUpoader";
import Navbar from "~/components/Navbar"

const Upload = () => {

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setstatusText] = useState('');
  const [file, setFile] = useState<File |null>(null)

  const handelFileSelect = (file :File | null) => {
    setFile(file)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {

  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16">
          <h1>smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" className="w-full" />
            </>
          ) : (
            <h2>Drop your Resume for an ATS score and improvement tips</h2>
          )}
          {!isProcessing && (
            <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
              </div>

              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>

              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
              </div>

              <div className="form-div">
                <label htmlFor="uploader">Uplaod Resume</label>
                <FileUploader onFileSelect={handelFileSelect}/>
              </div>

              <button className="primary-button" type="submit">
                Analyze Resume
              </button>

            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default Upload