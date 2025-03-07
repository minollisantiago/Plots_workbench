export type lineData = Array<{
  x: (number | string)[];
  y: number[];
  name?: string;
  yaxis?: 'y' | 'y2';
  visible?: boolean;
}>;
