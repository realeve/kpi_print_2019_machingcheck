import React, { useState, useEffect } from 'react';
import { IQuestion } from '../pages/Paper';
import { List, Card } from 'antd-mobile';
import * as R from 'ramda';
import RadioComponent from './RadioComponent';
import styles from './nestRadio.less';

export interface IQuestionItem {
  title: string;
  data: string[];
}
const NextRadio = function({
  idx: key,
  title,
  data,
  onChange,
  state,
  subTitle,
  showErr,
  ...props
}: IQuestion) {
  const [option, setOption]: [string[], any] = useState(state[key] || []);
  const [paper, setPaper]: [IQuestionItem[], any] = useState([]);
  useEffect(() => {
    subTitle = subTitle || [];
    let res = data.map((title: string) => ({
      title,
      data: subTitle,
    }));
    setPaper(res);
  }, [data]);

  const onRadioChange = (value: string[]) => {
    let nextOption: string[] = R.clone(value);
    setOption(nextOption);
    let nextState = R.clone(state);
    nextState[key] = nextOption;
    onChange(nextState);
  };

  return (
    <List renderHeader={title} {...props} className={styles.nest}>
      {paper.map((item: IQuestionItem, value: number) => (
        <Card key={value}>
          <RadioComponent
            title={`${key + 1}-${value + 1}.${item.title}`}
            idx={value}
            key={value}
            data={item.data}
            onChange={onRadioChange}
            state={option}
            showErr={showErr}
          />
        </Card>
      ))}
    </List>
  );
};

export default NextRadio;
