/** Self-contained educational game model. All amounts are fictional game coins. */
export type Game = {
  step: number; unlocked: number; goal: number; allowance: number;
  save: number; skill: number; spend: number; reaction: number | null;
};
export const goals = [
  { name: 'دوچرخه', icon: '🚲', price: 1000 },
  { name: 'دوربین', icon: '📸', price: 1400 },
  { name: 'سفر', icon: '🧳', price: 1800 },
];
export const stations = [
  'رؤیای من', 'کیف پول من', 'برنامه مالی', 'انتخاب هوشمند', 'شهر آینده من',
];
export const reactions = [
  { title: 'هدیه رو همین حالا می‌خرم', detail: '۸۰ سکه از بودجه خرج' },
  { title: 'از مهارتم کمک می‌گیرم', detail: 'با یادگیری مهارت، ارزش خلق می‌کنم' },
  { title: 'یک هدیه ساده‌تر انتخاب می‌کنم', detail: '۳۰ سکه از بودجه خرج' },
];
export const initialGame: Game = {
  step: 0, unlocked: 0, goal: 0, allowance: 300,
  save: 40, skill: 30, spend: 30, reaction: null,
};
export function validGame(input: unknown): input is Game {
  if (!input || typeof input !== 'object') return false;
  const g = input as Record<string, unknown>;
  const inRange = (name: string, lo: number, hi: number) => typeof g[name] === 'number' && Number.isInteger(g[name]) && (g[name] as number) >= lo && (g[name] as number) <= hi;
  return inRange('step', 0, 4) && inRange('unlocked', 0, 4) && inRange('goal', 0, goals.length - 1)
    && [300, 400, 500].includes(g.allowance as number)
    && inRange('save', 0, 100) && inRange('skill', 0, 100) && inRange('spend', 0, 100)
    && (g.save as number) + (g.skill as number) + (g.spend as number) === 100
    && (g.reaction === null || inRange('reaction', 0, 2));
}
export function outcome(game: Game, alternative: number | null = null) {
  const choice = alternative ?? game.reaction;
  const savings = Math.round((game.allowance * game.save) / 100);
  const skillBudget = (game.allowance * game.skill) / 100;
  const expense = choice === 0 ? 80 : choice === 2 ? 30 : 0;
  const earned = choice === 1 ? Math.round(skillBudget * 0.5) : 0;
  const wallet = Math.max(0, Math.round((game.allowance * game.spend) / 100 - expense + earned));
  const totalSavings = savings + (choice === 1 ? earned : 0);
  const progress = Math.min(100, Math.round((totalSavings / goals[game.goal].price) * 100));
  return { savings: totalSavings, wallet, progress };
}
