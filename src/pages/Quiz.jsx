import { useState } from "react";
import Footer from "@/components/Footer";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Timer,
  Zap,
  Target,
} from "lucide-react";
import NavBar from "@/components/NavBar";

const questions = [
  {
    question: "Wer ist der Protagonist von 'Naruto'?",
    options: ["Sasuke Uchiha", "Naruto Uzumaki", "Kakashi Hatake", "Itachi Uchiha"],
    correct: 1,
    difficulty: "leicht",
    category: "Shonen",
  },
  {
    question: "Wie heißt der Piratenkönig in 'One Piece'?",
    options: ["Monkey D. Luffy", "Shanks", "Gol D. Roger", "Whitebeard"],
    correct: 2,
    difficulty: "leicht",
    category: "Shonen",
  },
  {
    question: "Welcher Anime hat die meisten Episoden?",
    options: ["One Piece", "Naruto", "Detective Conan", "Dragon Ball"],
    correct: 2,
    difficulty: "mittel",
    category: "Allgemein",
  },
  {
    question: "Wer erschuf 'Attack on Titan'?",
    options: ["Eiichiro Oda", "Hajime Isayama", "Masashi Kishimoto", "Akira Toriyama"],
    correct: 1,
    difficulty: "mittel",
    category: "Wissen",
  },
  {
    question: "Was ist ein 'Shonen' Manga?",
    options: ["Für erwachsene Frauen", "Für junge Männer", "Für Kinder unter 6", "Für Senioren"],
    correct: 1,
    difficulty: "leicht",
    category: "Wissen",
  },
  {
    question: "Wie heißt Gokus stärkste Form?",
    options: ["Super Saiyan Blue", "Ultra Instinct", "Super Saiyan 4", "Kaioken"],
    correct: 1,
    difficulty: "mittel",
    category: "Shonen",
  },
  {
    question: "Welches Studio produzierte 'Spirited Away'?",
    options: ["Toei Animation", "Studio Ghibli", "Madhouse", "MAPPA"],
    correct: 1,
    difficulty: "leicht",
    category: "Studio",
  },
  {
    question: "Was bedeutet 'Manga' wörtlich übersetzt?",
    options: ["Lustige Bilder", "Zwangloses Bild", "Schnelle Zeichnung", "Bunte Geschichte"],
    correct: 1,
    difficulty: "schwer",
    category: "Wissen",
  },
  {
    question: "Welcher Titan ist der größte in AoT?",
    options: ["Koloss Titan", "Gründer Titan", "Kriegshammer Titan", "Bestien Titan"],
    correct: 0,
    difficulty: "mittel",
    category: "Shonen",
  },
  {
    question: "Wer ist der Mangaka von 'One Piece'?",
    options: ["Akira Toriyama", "Masashi Kishimoto", "Eiichiro Oda", "Tite Kubo"],
    correct: 2,
    difficulty: "leicht",
    category: "Wissen",
  },
];

const HIGHSCORE_KEY = "ani-me-quiz-highscore";

const QuizPage = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [totalTime, setTotalTime] = useState(0);

  const highScore = parseInt(localStorage.getItem(HIGHSCORE_KEY) || "0", 10);

  const handleAnswer = (index) => {
    if (answered) return;

    setSelected(index);
    setAnswered(true);

    if (index === questions[current].correct) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (current + 1 >= questions.length) {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      setTotalTime(elapsed);
      setFinished(true);

      if (score + (selected === questions[current].correct ? 0 : 0) > highScore) {
        localStorage.setItem(HIGHSCORE_KEY, String(score));
      }
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setAnswered(false);
    setFinished(false);
    setStreak(0);
    setMaxStreak(0);
  };

  const q = questions[current];

  const diffColor = (d) => {
    if (d === "leicht") return "bg-anime-online/20 text-anime-online";
    if (d === "mittel") return "bg-primary/20 text-primary";
    return "bg-anime-brand/20 text-anime-brand";
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-anime-brand" />
            <h1 className="text-xl font-bold text-foreground">Anime Quiz</h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Trophy className="w-3 h-3 text-anime-brand" /> Highscore: {highScore}
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> Streak: {streak}
            </span>
          </div>
        </div>

        {!finished ? (
          <div className="rounded-lg bg-anime-surface border border-anime-border p-6">
            <h2 className="text-base font-semibold text-foreground mb-5">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((option, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full text-left px-4 py-3 rounded-lg bg-secondary border border-anime-border text-sm font-medium"
                >
                  {option}
                </button>
              ))}
            </div>

            {answered && (
              <button
                onClick={nextQuestion}
                className="w-full mt-5 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
              >
                Nächste Frage →
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-anime-surface border border-anime-border p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              Quiz beendet!
            </h2>
            <p className="text-3xl font-bold text-primary mb-1">
              {score} / {questions.length}
            </p>

            <button
              onClick={restart}
              className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground"
            >
              Nochmal spielen
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default QuizPage;