export const entranceVisitType = (data: number) => {
  switch (data) {
    case 1:
      return '一般客として来場';
    case 2:
      return "スタッフとして来場";
    case 0:
      return "非来場";
    default:
      return "";
  }
}