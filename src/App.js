import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [sql, setSql] = useState(""); 
  const [params, setParams] = useState(""); 
  const [outPut, setOutPut] = useState("");  

  const formatSql = (sql) => { 
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'ORDER BY',
      'HAVING', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM','CASE','END'
    ]; 
  
      let formattedSql = sql;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        formattedSql = formattedSql.replace(regex, `\n${keyword}`);
      });
  
      formattedSql = formattedSql
        .replace(/\s+(\b(?:AND|OR|BETWEEN|NOT)\b)\s+/gi, `\n  $1 `) 
        .replace(/\s+(?=\()/g, '')
        .replace(/\s+(\(\s*\d{4}-\d{2}-\d{2}\s*\))/g, ' $1');
  
        formattedSql = formattedSql
        // .replace(/\s+AS\s+(\w+)/gi, `\nAS $1`) // Xuống dòng sau AS
        .replace(/(AS\s+\w+),/gi, `$1\n,`) // Xuống dòng trước dấu , sau alias
        // .replace(/(AS\s+\w+)\s*,/gi, `$1,\n`) // Xuống dòng sau dấu , sau alias
        .replace(/(AS\s+\w+)\s+/gi, `$1\n`); // Xuống dòng sau alias
  
      formattedSql = formattedSql
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n  ');
  
      return formattedSql.trim();
  };
  const processParameters = (paramString) => { 
    const parametersArray = paramString
      .replace(/^Parameters:\s*/, '') 
      .replace(/\(String\)/g, '')  
      .split(/\s*,\s*/)           
      .map(param => param.trim());    
    return parametersArray;
  };

  const handleProcessSql = () => {
    if(sql.trim()===""){
      alert("SQL is Empty");
      return;
    }
  if(params.trim()===""){
      alert("Param is Empty");
      return;
    } 
  const regex = /\/\*.*?\*\//gs;
  const cleanedSql = sql.replace(regex, '');  
  const parameters = processParameters(params); 
  let replacementIndex = 0;  
  const newSql = cleanedSql.replace(/\?/g, () => {
    if (replacementIndex < parameters.length) {
      return "'" + parameters[replacementIndex++] + "'";
    } else {
      return '?'; 
    }
  });  
  const formattedSql = formatSql(newSql);
  setOutPut(formattedSql);
  };

  return (
    <div className="App">
      <header className="">
        <div className="container-fluid">
          {/* <h1>Responsive Columns</h1> */}
          <div className="row">
            <div className="col-sm-6 p-3 text-white">
              <span className='fl'>
                <h6 style={{ color: '#0066CC', float: "left" }}>
                   SQL
                </h6>
              </span>
              <span className='fr'>
                <button type="button" className="btn btn-success btn-sm"
                  onClick={handleProcessSql}
                >Set Paramester</button>&nbsp;
                <button type="button" className="btn btn-success btn-sm" >Clear</button>
              </span>
              <textarea id='sql' style={{ width: '100%' }} rows={17}
                value={sql}
                onChange={(e) => setSql(e.target.value)}
              >

              </textarea>
              <h6 style={{ color: '#0066CC', float: "left" }}>
                Params
              </h6>
              <textarea id='param' style={{ width: '100%' }} rows={6}
                value={params}
                onChange={(e) => setParams(e.target.value)}
              > 
              </textarea>
            </div>
            <div className="col-sm-6 p-3 text-white">
            <span className='fl'>
                <h6 style={{ color: '#0066CC', float: "left" }}>
                  Result
                </h6>
              </span>
              <span className='fr'>
                <button type="button" className="btn btn-success btn-sm" >Copy</button>
              </span>
              <textarea id='outPut' style={{ width: '100%' }} rows={24}
                value={outPut}
              > 
              </textarea>
            </div>

          </div>
        </div>
      </header>
    </div>
  );
} 
export default App;
