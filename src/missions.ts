export const spellingMissions=[
 {sample:'ma',tone:1,distractors:['ba','na']},{sample:'ba',tone:4,distractors:['pa','ma']},{sample:'mi',tone:3,distractors:['yi','ma']},{sample:'tu',tone:2,distractors:['wu','ta']},
 {sample:'yi',tone:1,distractors:['mi','wu']},{sample:'wu',tone:3,distractors:['tu','yi']},{sample:'na',tone:2,distractors:['la','ma']},{sample:'la',tone:1,distractors:['na','ga']},
 {sample:'da',tone:4,distractors:['ta','ga']},{sample:'ga',tone:3,distractors:['da','ba']},{sample:'pa',tone:4,distractors:['ba','ma']},{sample:'ta',tone:2,distractors:['da','tu']},
];
export const twinMissions=[
 {sample:'ma',a:1,b:1},{sample:'ma',a:1,b:4},{sample:'ba',a:2,b:3},{sample:'ba',a:4,b:4},{sample:'mi',a:2,b:2},{sample:'mi',a:3,b:4},
 {sample:'tu',a:1,b:2},{sample:'tu',a:3,b:3},{sample:'yi',a:4,b:1},{sample:'yi',a:2,b:2},{sample:'wu',a:3,b:4},{sample:'wu',a:1,b:1},
];
export function shuffled<T>(values:T[]):T[]{const result=[...values];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
