
/// <reference types="react" />

// Type declaration for Interview type
declare global {
  // Speech Recognition API types
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
    SpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start: () => void;
    stop: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionError) => void;
  }

  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }

  interface SpeechRecognitionError {
    error: string;
    message: string;
  }
  
  // Additional types for your application
  type InterviewType = {
    id: string;
    title: string;
    description: string;
    duration: number;
    difficulty: "easy" | "medium" | "hard";
    type: string;
    questions: string[];
    isCustom?: boolean;
  };

  type InterviewResult = {
    id: string;
    interview_id: string;
    user_id: string;
    score: number;
    date: string;
    answers: string[];
    feedback: string;
  };

  type InterviewQuestion = {
    id: string;
    template_id: string;
    question_text: string;
    question_type: string;
    difficulty: "easy" | "medium" | "hard";
  };
}

export {};
