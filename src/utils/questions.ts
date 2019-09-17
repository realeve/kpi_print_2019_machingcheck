import * as lib from './lib';

// 题目
export interface IPaper {
  title: string;
  data: string | string[];
  subTitle?: string | string[];
  type?: string;
  cascade?: number;
  [key: string]: any;
}

let paper: IPaper[] = [
  {
    type: 'textarea',
    title: '姓名',
    data: '',
  },
  {
    type: 'textarea',
    title: '卡号',
    data: '',
  },
];

export let paperData = lib.handlePaper(paper);

export default paperData;
