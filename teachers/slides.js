/* Truck Talk Teachers — turns one curriculum day or grammar unit into an
 * ordered list of "slides" for the live classroom stage.
 *
 * Pure and Firebase-free on purpose: the live room (see live.js) only ever
 * syncs a *slide index*, never slide content — every participant's browser
 * already has curriculum.js/grammar.js loaded, so as long as this function
 * is deterministic, the host and every joined device compute the exact
 * same slide list from the same {kind, ref} and stay in sync from one
 * small integer.
 */

export function findSource(kind, ref){
  if (kind === "day"){
    const day = (typeof CURRICULUM !== "undefined" ? CURRICULUM : []).find(d => d.d === ref);
    return day ? { kind, ref, title: day.t } : null;
  }
  const unit = (typeof GRAMMAR !== "undefined" ? GRAMMAR : []).find(u => u.id === ref);
  return unit ? { kind, ref, title: unit.title } : null;
}

export function buildSlides(source){
  if (!source) return [];
  return source.kind === "day" ? buildDaySlides(source.ref) : buildGrammarSlides(source.ref);
}

function buildDaySlides(dayNum){
  const day = (typeof CURRICULUM !== "undefined" ? CURRICULUM : []).find(d => d.d === dayNum);
  if (!day) return [];
  const slides = [{ type: "dayTitle", day }];
  if (day.v && day.v.length) slides.push({ type: "vocab", day });
  if (day.dl && day.dl.length) slides.push({ type: "dialogue", day });
  if (day.g) slides.push({ type: "grammarTip", day });
  (day.qz || []).forEach((q, i) => slides.push({ type: "quiz", day, quizIndex: i, q }));
  if (day.sp) slides.push({ type: "speaking", day });
  slides.push({ type: "dayEnd", day });
  return slides;
}

function buildGrammarSlides(unitId){
  const unit = (typeof GRAMMAR !== "undefined" ? GRAMMAR : []).find(u => u.id === unitId);
  if (!unit) return [];
  const slides = [{ type: "unitTitle", unit }];
  if (unit.teach && unit.teach.length) slides.push({ type: "teachNotes", unit });
  if (unit.explain && unit.explain.length) slides.push({ type: "explain", unit });
  if (unit.examples && unit.examples.length) slides.push({ type: "examples", unit });
  if (unit.mistakeWrong) slides.push({ type: "mistake", unit });
  (unit.quiz || []).forEach((q, i) => slides.push({ type: "quiz", unit, quizIndex: i, q }));
  slides.push({ type: "unitEnd", unit });
  return slides;
}

export function slideLabel(slide){
  const labels = {
    dayTitle: "Title", vocab: "Vocabulary", dialogue: "Dialogue", grammarTip: "Grammar",
    quiz: "Quiz", speaking: "Speaking", dayEnd: "Leaderboard",
    unitTitle: "Title", teachNotes: "Teacher notes", explain: "Explanation", examples: "Examples",
    mistake: "Common mistake", unitEnd: "Leaderboard",
  };
  return labels[slide.type] || slide.type;
}
