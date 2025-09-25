// Define the TypeScript interface for fallbackStats
export interface StatsType {
  dataCollection: {
    audioHours: {
      total: number;
      byLanguage: Record<string, number>;
    };
    transcribedHours: {
      total: number;
      byLanguage: Record<string, number>;
    };
    speakers: {
      total: number;
      byGender: Record<string, number>;
      byRegion: Record<string, number>;
    };
  };
  modelPerformance: {
    speechToText: {
      werScores: Record<string, number>;
      improvementFromBaseline: Record<string, number>;
    };
    textToSpeech: {
      mosScores: Record<string, number>;
    };
  };
  timeline: {
    projectStart: string;
    lastUpdated: string;
    nextMilestone: string;
  };
  impact: {
    downloads: number;
    citations: number;
    activeContributors: number;
    researchPapers: number;
  };
}

// Fallback data for when API fails to load
export const fallbackStats: StatsType = {
  "dataCollection": {
    "audioHours": {
      "total": 1250,
      "byLanguage": {
        "isiZulu": 450,
        "isiXhosa": 350,
        "Sesotho": 200,
        "Setswana": 150,
        "Xitsonga": 100,
        "Tshivenda": 75,
        "Siswati": 50
      }
    },
    "transcribedHours": {
      "total": 875,
      "byLanguage": {
        "isiZulu": 325,
        "isiXhosa": 275,
        "Sesotho": 150,
        "Setswana": 75,
        "Xitsonga": 50,
        "Tshivenda": 45,
        "Siswati": 30
      }
    },
    "speakers": {
      "total": 2500,
      "byGender": {
        "female": 1300,
        "male": 1100,
        "nonBinary": 100
      },
      "byRegion": {
        "KwaZuluNatal": 650,
        "Gauteng": 550,
        "EasternCape": 400,
        "WesternCape": 350,
        "FreeState": 200,
        "Limpopo": 150,
        "NorthWest": 100,
        "Mpumalanga": 50,
        "NorthernCape": 50
      }
    }
  },
  "modelPerformance": {
    "speechToText": {
      "werScores": {
        "isiZulu": 15.4,
        "isiXhosa": 17.2,
        "Sesotho": 19.8,
        "Setswana": 20.5,
        "Xitsonga": 22.1,
        "Tshivenda": 24.3,
        "Siswati": 26.7
      },
      "improvementFromBaseline": {
        "isiZulu": 32,
        "isiXhosa": 28,
        "Sesotho": 25,
        "Setswana": 22,
        "Xitsonga": 20,
        "Tshivenda": 18,
        "Siswati": 15
      }
    },
    "textToSpeech": {
      "mosScores": {
        "isiZulu": 4.2,
        "isiXhosa": 4.0,
        "Sesotho": 3.8,
        "Setswana": 3.7,
        "Xitsonga": 3.5,
        "Tshivenda": 3.2,
        "Siswati": 3.0
      }
    }
  },
  "timeline": {
    "projectStart": "2024-01-15",
    "lastUpdated": "2025-09-01",
    "nextMilestone": "2025-12-01"
  },
  "impact": {
    "downloads": 15000,
    "citations": 25,
    "activeContributors": 45,
    "researchPapers": 8
  }
};