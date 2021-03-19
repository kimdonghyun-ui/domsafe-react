import React from 'react';
import logo from './logo.svg';
import './App.css';

import marked from 'marked';
import DOMPurify from 'dompurify';

const linkRenderer = new marked.Renderer();

linkRenderer.link = (href, title, text) => {
  title = title ? title : href;
  text = text ? text : href;

  return `<a target='_blank' href='${href}' title='${title}'>${text}</a>`;
};

//1. React 에서 제공하는 dangerouslySetInnerHTML
//1번은 React 에서 기본적으로 제공해주는거고 html 을 인자로 넘기고 사용하기
//위해 쓰는 놈이예요.아무 처리 안하고 그냥 html 을 변환해 줍니다.
//1번은 아주 위험하죠? (사용자의 입력에 대해 검증을 안하니까)
//그래서 이름이 dangerouslySetInnerHTML 입니다
const Normal = (props) => (
  <React.Fragment>
    <div dangerouslySetInnerHTML={{ __html: props.desc }} />
  </React.Fragment>
);

//2. Dompurify
//2번은 1번의 단점을 보완하기 위해서 위험한 코드들을 제거해 버리는 놈이예요
//알아서 위험해 보이는 부분은 자동으로 제거
const Purify = (props) => (
  <React.Fragment>
    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(props.desc) }} />
  </React.Fragment>
);

//3. Marked
//하지만, 이걸로 만족 못하고 난 내가 허용해 주는 놈만 허용하게 할꺼야
//그렇게 할려면
//Dompurify 와 marked 를 적절히 조합하면 되요
//2번은 자동으로 해준다면 3번은 내가원하는거만 수동으로 설정해서 허용해주는 형태이다.
const Marked = (props) => (
  <React.Fragment>
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          marked.parse(props.desc, { renderer: linkRenderer }),
          {
            ALLOWED_TAGS: ['h1'],
            ALLOWED_ATTR: ['href', 'target', 'title'],
          }
        ),
      }}
    />
  </React.Fragment>
);





function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Normal desc="그냥 마크업 을 있는 그대로 <br />넣어진다"></Normal>
        <Purify desc="<script>alert('this is danger')</script>"></Purify>
        <Marked desc="<a href='https://daum.net'>daum</a><h1>이것은 허용되지 않은 html</h1>"></Marked>
      </header>
    </div>
  );
}

export default App;
