import { useState, useEffect, useRef } from "react";

const QUIZ_DATA = {
  withMangroves: [
    {
      stage: 1,
      stageLabel: "Early Roots",
      triggerCount: 1,
      question: "How much carbon can a healthy mangrove forest store compared to a typical tropical forest?",
      options: ["About the same", "2x more", "Up to 4x more", "Half as much"],
      correctIndex: 2,
      fact: "Mangroves store up to 4x more carbon per hectare than most tropical forests — mostly in their waterlogged soils, which can lock carbon for thousands of years.",
      factID: "Fakta Keren",
    },
    {
      stage: 2,
      stageLabel: "Nursery Coast",
      triggerCount: 10,
      question: "What percentage of tropical fish species depend on mangroves at some point in their life cycle?",
      options: ["Around 5%", "Around 20%", "Around 50%", "Over 75%"],
      correctIndex: 3,
      fact: "More than 75% of tropical fish species rely on mangrove ecosystems during their juvenile stages. Without these nurseries, fisheries collapse.",
      factID: "Did You Know?",
    },
    {
      stage: 3,
      stageLabel: "Protection Belt",
      triggerCount: 50,
      question: "During the 2004 Indian Ocean tsunami, villages with mangroves in front of them experienced what?",
      options: [
        "No difference in damage",
        "Significantly less damage and fewer deaths",
        "More flooding due to trapped water",
        "Only minor differences",
      ],
      correctIndex: 1,
      fact: "Studies found that coastal communities with intact mangrove belts suffered significantly less damage and casualties. The dense root systems absorbed wave energy before it reached shore.",
      factID: "Real-World Impact",
    },
    {
      stage: 4,
      stageLabel: "Biodiversity Hub",
      triggerCount: 100,
      question: "Indonesia holds roughly what share of the world's total mangrove forest?",
      options: ["Around 5%", "Around 15%", "Around 22%", "Around 40%"],
      correctIndex: 2,
      fact: "Indonesia holds approximately 22% of the world's mangrove forests — the largest share of any single country. Yet Indonesia has also lost more mangrove area than any other nation in the last 30 years.",
      factID: "Indonesia Fact",
    },
    {
      stage: 5,
      stageLabel: "Living Coastline",
      triggerCount: 300,
      question: "How fast can mangroves naturally expand a coastline by trapping sediment?",
      options: [
        "They don't — they only hold existing land",
        "A few centimetres per year",
        "Up to several metres per year in ideal conditions",
        "Only during monsoon seasons",
      ],
      correctIndex: 2,
      fact: "In ideal conditions, healthy mangrove stands can trap enough sediment to expand the coastline by several metres per year — literally building new land while protecting what exists.",
      factID: "Surprising Science",
    },
  ],
  withoutMangroves: [
    {
      stage: 1,
      stageLabel: "Bare Coast",
      triggerCount: 1,
      question: "Without mangrove roots, coastal soil is vulnerable to erosion. How quickly can an unprotected coastline erode?",
      options: [
        "Only during major storms",
        "A few millimetres per year at most",
        "Up to several metres per year",
        "Erosion only affects sandy beaches",
      ],
      correctIndex: 2,
      fact: "Unprotected coastlines can erode at rates of several metres per year. Mangrove roots bind sediment so effectively that their removal often triggers rapid, irreversible land loss.",
      factID: "Sobering Reality",
    },
    {
      stage: 2,
      stageLabel: "Exposed Shore",
      triggerCount: 10,
      question: "When mangroves disappear, what typically happens to local fishing catches in nearby waters?",
      options: [
        "Catches stay roughly the same",
        "Catches improve due to less shade",
        "Catches can drop by 20–50%",
        "Only deep-sea fishing is affected",
      ],
      correctIndex: 2,
      fact: "Studies across Southeast Asia show that fish and shrimp catches can decline by 20–50% within years of mangrove clearing, as juvenile fish lose the sheltered nursery habitat they depend on.",
      factID: "Food Security Alert",
    },
    {
      stage: 3,
      stageLabel: "Open Shore",
      triggerCount: 50,
      question: "What is the estimated economic cost of losing one hectare of mangrove forest per year?",
      options: ["Under $100", "Around $1,000", "Between $3,000–$9,000", "Over $50,000"],
      correctIndex: 2,
      fact: "Economists estimate the loss of one hectare of mangrove costs between $3,000–$9,000 per year in lost ecosystem services — coastal protection, fisheries support, carbon storage, and water filtration.",
      factID: "Economic Impact",
    },
    {
      stage: 4,
      stageLabel: "Declining Coast",
      triggerCount: 100,
      question: "How much more powerful are storm waves hitting an unprotected coastline compared to one with mangroves?",
      options: [
        "Roughly the same energy",
        "About 25% more powerful",
        "Up to 70% more wave energy reaches the shore",
        "Only slightly more in shallow water",
      ],
      correctIndex: 2,
      fact: "Research shows mangrove belts can reduce wave energy by up to 70% before it reaches the shore. Without them, that full force strikes the coastline — amplifying flood damage, erosion, and storm surge.",
      factID: "Physics of Protection",
    },
    {
      stage: 5,
      stageLabel: "Fragile Coast",
      triggerCount: 1000,
      question: "Globally, what percentage of mangrove forests have been lost in the last 50 years?",
      options: ["About 10%", "About 25%", "About 35%", "Over 50%"],
      correctIndex: 2,
      fact: "Approximately 35% of the world's mangrove forests have been lost since the 1970s — cleared for shrimp farms, development, and logging. The pace of loss is slowing but restoration remains far behind the rate of destruction.",
      factID: "Global Crisis",
    },
  ],
};

function QuizModal({ quiz, onClose, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx) => {
    if (revealed) return;
    setSelected(idx);
    setRevealed(true);
    onAnswer(idx === quiz.correctIndex);
  };

  const isCorrect = selected === quiz.correctIndex;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)",
      padding: "1rem",
    }}>
      <div style={{
        background: "#0d2b2b",
        borderRadius: "20px",
        maxWidth: "520px",
        width: "100%",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        animation: "slideUp 0.3s ease",
      }}>
        <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .quiz-opt {
            width: 100%;
            text-align: left;
            padding: 12px 16px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.04);
            color: #e8f5f0;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          .quiz-opt:hover:not(:disabled) {
            background: rgba(255,255,255,0.09);
            border-color: rgba(255,255,255,0.22);
          }
          .quiz-opt:disabled { cursor: default; }
          .quiz-opt.correct { background: rgba(29,158,117,0.25); border-color: #1d9e75; color: #9fe1cb; }
          .quiz-opt.wrong { background: rgba(216,90,48,0.2); border-color: #d85a30; color: #f0997b; }
          .quiz-close {
            width: 100%;
            padding: 13px;
            border-radius: 10px;
            border: none;
            background: #1d9e75;
            color: #04342c;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.15s;
            margin-top: 4px;
          }
          .quiz-close:hover { background: #5dcaa5; }
        `}</style>

        <div style={{ padding: "24px 24px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px"
          }}>
            <span style={{
              fontSize: "10px", letterSpacing: "0.12em", fontWeight: 600,
              color: "#1d9e75", textTransform: "uppercase",
            }}>Stage unlock</span>
            <span style={{
              fontSize: "10px", letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
            }}>{quiz.stageLabel}</span>
          </div>

          <p style={{
            fontSize: "16px", fontWeight: 600, color: "#e8f5f0",
            lineHeight: 1.45, margin: "0 0 20px",
          }}>{quiz.question}</p>
        </div>

        <div style={{ padding: "0 24px" }}>
          {quiz.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-opt${revealed ? (i === quiz.correctIndex ? " correct" : i === selected ? " wrong" : "") : ""}`}
              onClick={() => handleSelect(i)}
              disabled={revealed}
            >
              <span style={{
                display: "inline-block", width: "20px", height: "20px",
                borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center", lineHeight: "18px", fontSize: "11px",
                marginRight: "10px", flexShrink: 0,
                background: revealed && i === quiz.correctIndex ? "#1d9e75" :
                  revealed && i === selected && i !== quiz.correctIndex ? "#d85a30" : "transparent",
                color: revealed && (i === quiz.correctIndex || i === selected) ? "#fff" : "rgba(255,255,255,0.4)",
              }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          ))}
        </div>

        {revealed && (
          <div style={{
            margin: "0 24px 20px",
            padding: "14px 16px",
            background: isCorrect ? "rgba(29,158,117,0.12)" : "rgba(216,90,48,0.1)",
            borderRadius: "10px",
            borderLeft: `3px solid ${isCorrect ? "#1d9e75" : "#d85a30"}`,
            animation: "slideUp 0.2s ease",
          }}>
            <p style={{
              fontSize: "10px", letterSpacing: "0.1em", fontWeight: 700,
              color: isCorrect ? "#5dcaa5" : "#f0997b",
              textTransform: "uppercase", margin: "0 0 6px",
            }}>
              {isCorrect ? "Correct! " : "Not quite — "}{quiz.factID}
            </p>
            <p style={{
              fontSize: "13px", color: "#b8ddd0", lineHeight: 1.6, margin: 0,
            }}>{quiz.fact}</p>
          </div>
        )}

        <div style={{ padding: "0 24px 24px" }}>
          {revealed ? (
            <button className="quiz-close" onClick={onClose}>
              Continue exploring →
            </button>
          ) : (
            <button
              style={{
                width: "100%", padding: "13px", borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.12)",
                background: "transparent", color: "rgba(255,255,255,0.35)",
                fontSize: "13px", cursor: "pointer",
              }}
              onClick={onClose}
            >
              Skip this question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MangroveQuiz({ currentCount, mode }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [seenStages, setSeenStages] = useState(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const prevCountRef = useRef(currentCount);
  const prevModeRef = useRef(mode);

  useEffect(() => {
    if (prevModeRef.current !== mode) {
      setSeenStages(new Set());
      prevModeRef.current = mode;
    }

    const dataset = mode === "withMangroves"
      ? QUIZ_DATA.withMangroves
      : QUIZ_DATA.withoutMangroves;

    const prevCount = prevCountRef.current;
    prevCountRef.current = currentCount;

    for (const quiz of dataset) {
      const stageKey = `${mode}-${quiz.stage}`;
      if (seenStages.has(stageKey)) continue;

      const crossedThreshold =
        (prevCount < quiz.triggerCount && currentCount >= quiz.triggerCount) ||
        (prevCount > quiz.triggerCount && currentCount <= quiz.triggerCount);

      if (crossedThreshold) {
        setActiveQuiz(quiz);
        setSeenStages((prev) => new Set([...prev, stageKey]));
        break;
      }
    }
  }, [currentCount, mode]);

  const handleAnswer = (isCorrect) => {
    setScore((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
  };

  return (
    <>
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onAnswer={handleAnswer}
        />
      )}

      {score.total > 0 && !activeQuiz && (
        <div style={{
          position: "fixed", bottom: "24px", right: "24px",
          background: "#0d2b2b", borderRadius: "12px",
          border: "1px solid rgba(29,158,117,0.3)",
          padding: "10px 16px",
          display: "flex", alignItems: "center", gap: "10px",
          zIndex: 999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}>
          <span style={{ fontSize: "13px", color: "#5dcaa5" }}>
            {score.correct}/{score.total} correct
          </span>
          <div style={{
            height: "6px", width: "80px", borderRadius: "3px",
            background: "rgba(255,255,255,0.1)",
          }}>
            <div style={{
              height: "100%", borderRadius: "3px",
              width: `${Math.round((score.correct / score.total) * 100)}%`,
              background: "#1d9e75",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      )}
    </>
  );
}
