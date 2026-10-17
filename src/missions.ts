export const spellingMissions=[
 {sample:'ma',tone:1,distractors:['ba','pa']},{sample:'ba',tone:4,distractors:['pa','ma']},{sample:'mi',tone:3,distractors:['ni','li']},{sample:'tu',tone:2,distractors:['du','lu']},
 {sample:'yi',tone:1,distractors:['wu','yu']},{sample:'wu',tone:3,distractors:['yi','yu']},{sample:'ma',tone:2,distractors:['na','la']},{sample:'ba',tone:1,distractors:['da','ga']},
 {sample:'mi',tone:4,distractors:['di','ti']},{sample:'tu',tone:3,distractors:['bu','pu']},{sample:'yi',tone:4,distractors:['ji','qi']},{sample:'wu',tone:2,distractors:['gu','ku']},
];
export const twinMissions=[
 {sample:'ma',a:1,b:1},{sample:'ma',a:1,b:4},{sample:'ba',a:2,b:3},{sample:'ba',a:4,b:4},{sample:'mi',a:2,b:2},{sample:'mi',a:3,b:4},
 {sample:'tu',a:1,b:2},{sample:'tu',a:3,b:3},{sample:'yi',a:4,b:1},{sample:'yi',a:2,b:2},{sample:'wu',a:3,b:4},{sample:'wu',a:1,b:1},
];
export function shuffled<T>(values:T[]):T[]{const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
