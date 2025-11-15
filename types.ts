
export interface Fault {
  faultDescription: string;
  analysis: string;
  violatedRule: string;
}

export interface Report {
  partDescription: {
    title: string;
    details: string[];
  };
  faults: Fault[];
}

export interface ApiError {
  message: string;
}

export interface Part {
    inlineData: {
        mimeType: string;
        data: string;
    };
}
