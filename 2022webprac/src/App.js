
import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){
  return <header>
      <h1><a href="/" onClick={(event)=>{
        // event.preventDefault();
      }}>{props.title}</a></h1>
    </header>
}

function Article(props){
  return <article>
  <h2>{props.title}</h2>
  {props.body}
</article>
}

function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}><a id={t.id} href={'/read/'+t.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(Number(event. target.id));
    }}>{t.title}</a>
    </li>)
  }
  return  <nav>
    <ol>
      {lis}
    </ol>
</nav>
}

function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value; //title에 입력된거 가져옴
      const body = event.target.body.value;
      props.onCreate(title, body);

    }}>
      <p><input type="text" name = "title" placeholder='title'/></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type = 'submit' value = "create"></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
  <h2>Update</h2>
  <form onSubmit={event=>{
    event.preventDefault();
    const title = event.target.title.value;
    const body = event.target.body.value;
    props.onUpdate(title, body);
  }}>
    <p><input type="text" name = "title" placeholder='title' value={title} onChange={event=>{
      setTitle(event.target.value);
    }}/></p>
    <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
      setBody(event.target.value);
    }}></textarea></p>
    <p><input type = 'submit' value = "Update"></input></p>
  </form>
</article>
}

function App() {
  const [mode, setMode] = useState('WELCOME'); //setMode는 mode를 바꾸는 함수
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([ 
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'js is ...'}
  ]);
  let content = null;
  let contextControl = null;
  let realTitle = <><span>★</span>메<span>리</span>크<span>리</span>스<span>마</span>스<span>★</span></>


  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }
  else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    contextControl = <><li><a href = {"/update/"+id} onClick={event=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>Update</a></li>
    <li><input type="button" value ="Delelte" onClick={()=>{
      const newTopics =[]
      for(let i=0; i<topics.length; i++){
        if(topics[i].id !== id){
          newTopics.push(topics[i]);
        }
      }
      setTopics(newTopics);
    }}></input></li>
    </>
  }
  else if(mode === 'CREATE'){ //...이해않됨
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics] //위에 토픽리스트 받아와서 복사
      newTopics.push(newTopic); //복사된거에 새거넣기
      setTopics(newTopics); //그거를 새로운토픽으로 설정...?
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if(mode === 'UPDATE'){
      let title, body = null;
      for(let i=0; i<topics.length; i++){ //원래 글 가져오는 코드
        if(topics[i].id === id){
          title = topics[i].title;
          body = topics[i].body;
        }
      content = <Update title={title} body={body} onUpdate={(title, body)=>{
         console.log(title, body);
         const newTopics = [...topics]
         const updatedTopic = {id:id, title : title, body : body}
         for(let i=0; i<newTopics.length; i++){
          if(newTopics[i].id === id){
            newTopics[i] = updatedTopic;
            break;
          }
         }
         setTopics(newTopics);
         setMode('READ');
      }}></Update>
    }
  } 

  return (
   <div>
    <Header title={realTitle} onChangeMode={()=>{
      setMode('WELCOME');
    }}></Header>
    
    <div id= 'container'>
      <div id = 'grid'>
        <div id = 'index'>
          <Nav topics={topics} onChangeMode={(_id)=>{ 
            setMode('READ');
            setId(_id);
          }}></Nav>
        </div>
        <div id = 'article'>
          {content}
          <ul>
            <li><a href = '/create' onClick ={event=>{ //클릭 이벤트 일어남
              event.preventDefault(); //이벤트 안일어나게
              setMode('CREATE'); //create로 모드변경
            }}>Create</a></li>
            {contextControl}
          </ul>
        </div>
      </div>
    </div>
   </div>
  );
}

export default App;
