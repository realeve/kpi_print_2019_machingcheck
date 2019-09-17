import React from 'react';
import Result from '@/components/Result';
import { connect } from 'dva';
function ResultPage({ result }) {
  return <Result {...result} />;
}
export default connect(({ common: { result } }) => ({
  result,
}))(ResultPage);
