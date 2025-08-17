interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
  }
  
  interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
  }
  
  interface Feedback {
    overallScore: number;
    ATS: {
      score: number;
      tips: {
        type: "good" | "improve";
        tip: string;
      }[];
    };
    toneAndStyle: {
      score: number;
      tips: {
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }[];
    };
    content: {
      score: number;
      tips: {
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }[];
    };
    structure: {
      score: number;
      tips: {
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }[];
    };
    skills: {
      score: number;
      tips: {
        type: "good" | "improve";
        tip: string;
        explanation: string;
      }[];
    };
  }

declare module 'pdfjs-dist/build/pdf.mjs' {
  export const GlobalWorkerOptions: any;
  export function getDocument(options: any): any;
}

declare module 'pdfjs-dist/web/pdf.mjs' {
  export const GlobalWorkerOptions: any;
  export function getDocument(options: any): any;
}